# System Architecture

Bu belge, `@osn/modular` motorunun tasarım felsefesini, bileşen hiyerarşisini ve verilerin girişten çıkışa kadar nasıl aktığını açıklar.

---

## 1. Genel Bakış

`@osn/modular`, Discord botları için **piksel mükemmellikte kart görselleri** üretmek amacıyla tasarlanmış, Node.js üzerinde çalışan modüler bir canvas render motorudur. Sistem üç temel katmandan oluşur:

| Katman | Sorumluluk |
|---|---|
| **Public API** | Kullanıcının etkileşim kurduğu Builder sınıfları ve `createEngine` fabrikası |
| **Core Engine** | Tüm alt sistemleri koordine eden orkestratör |
| **Canvas Pipeline** | Gerçek çizim, stil ve tema işlemlerini yapan düşük seviyeli katman |

---

## 2. Üst Düzey Mimari

```mermaid
graph TD
    USER["👤 Kullanıcı Kodu\n(Discord Bot)"]

    subgraph PUBLIC_API["📦 Public API (@osn/modular)"]
        direction LR
        RC["RankCard"]
        PC["ProfileCard"]
        MC["MusicCard"]
        LC["Leaderboard"]
        IC["InviteCard"]
        WC["WelcomeCard"]
    end

    subgraph CORE["⚙️ Core Engine"]
        ENGINE["Engine\n(Orkestratör)"]
        PIPELINE["RenderPipeline\n(9 Aşamalı)"]
        BUILDER["CardBuilder\n(DSL Composer)"]
    end

    subgraph SUBSYSTEMS["🔧 Alt Sistemler"]
        TM["ThemeManager"]
        TE["TokenEngine"]
        SE["StyleEngine"]
        AL["AssetLoader"]
        BM["BufferManager"]
        PM["PluginManager"]
        CR["ComponentRegistry"]
        LP["LayoutParser"]
        LR["LayoutResolver"]
        LRU["LRUCache"]
    end

    CANVAS["🎨 CanvasRenderer\n(node-canvas)"]
    OUTPUT["📁 Buffer\n(PNG / JPEG / WebP)"]

    USER --> PUBLIC_API
    PUBLIC_API --> BUILDER
    BUILDER --> ENGINE
    ENGINE --> PIPELINE
    PIPELINE --> SUBSYSTEMS
    PIPELINE --> CANVAS
    CANVAS --> OUTPUT
```

---

## 3. Engine — Alt Sistem Başlatma Sırası

`Engine` nesnesi oluşturulduğunda, bağımlılıkları doğru sırada enjekte ederek tüm alt sistemleri hazır hale getirir:

```mermaid
sequenceDiagram
    participant U as Kullanıcı
    participant E as Engine
    participant C as LRUCache
    participant AL as AssetLoader
    participant R as CanvasRenderer
    participant TM as ThemeManager
    participant CR as ComponentRegistry
    participant PM as PluginManager

    U->>E: createEngine(options)
    E->>C: new LRUCache(options.cache)
    E->>AL: new AssetLoader(cache)
    E->>R: new CanvasRenderer(config)
    E->>TM: new ThemeManager()
    TM-->>E: Varsayılan temalar yüklendi
    E->>CR: new ComponentRegistry()
    CR-->>E: text, avatar, progress... kayıtlı
    E->>PM: new PluginManager(engine)
    E-->>U: Engine hazır ✓
```

---

## 4. RenderPipeline — 9 Aşamalı Akış

Bir `.render()` çağrısı yapıldığında, `RenderPipeline` aşağıdaki aşamaları sırasıyla çalıştırır:

```mermaid
flowchart LR
    START(["🟢 render(layout, data, options)"])

    P1["📐 Faz 1\nLayout Resolve\nAbsolut koordinat\nhesabı"]
    P2["🎨 Faz 2\nToken Resolve\nTema + değişken\nbirleştirme"]
    P3["💅 Faz 3\nStyle Resolve\nToken → görsel stil\ndönüşümü"]
    P4["🖼️ Faz 4\nAsset Preload\nGörsel ve font\nön yükleme"]
    P5["🔌 Faz 5\nPre-Render Hooks\nPlugin çalıştırma\n(beforeRender)"]
    P6["✏️ Faz 6\nComponent Render\nHer bileşen\ncanvas'a çizilir"]
    P7["✨ Faz 7\nFX Pass\nGlobal efektler\n(glow, scanline…)"]
    P8["🔌 Faz 8\nPost-Render Hooks\nPlugin çalıştırma\n(afterRender)"]
    P9["📦 Faz 9\nExport Encode\nPNG/JPEG/WebP\nbuffer çıktısı"]

    END(["🏁 Buffer döndürülür"])

    START --> P1 --> P2 --> P3 --> P4 --> P5 --> P6 --> P7 --> P8 --> P9 --> END
```

### Faz Detayları

| # | Faz | Kaynak Sınıf | Çıktı |
|---|---|---|---|
| 1 | Layout Resolve | `LayoutParser` + `LayoutResolver` | Resolve edilmiş koordinat ağacı |
| 2 | Token Resolve | `TokenEngine` + `ThemeManager` | Birleştirilmiş token haritası |
| 3 | Style Resolve | `StyleEngine` | Hesaplanmış stil objesi |
| 4 | Asset Preload | `AssetLoader` + `LRUCache` | Önbelleğe alınmış görseller |
| 5 | Pre-Render | `Engine.hooks.beforeRender` | — |
| 6 | Component Render | `ComponentRegistry` + `CanvasRenderer` | Çizilmiş canvas |
| 7 | FX Pass | `CanvasRenderer.applyEffect` | Post-process canvas |
| 8 | Post-Render | `Engine.hooks.afterRender` | — |
| 9 | Export Encode | `BufferManager` | `Buffer` (PNG/JPEG/WebP) |

---

## 5. Tema Sistemi Veri Akışı

Tema sistemi **veri odaklı** (data-driven) bir yaklaşım izler. Temalar çizmez; yalnızca token değerleri sağlar.

```mermaid
flowchart TD
    subgraph THEME_SYS["🎨 Tema Sistemi"]
        BUILTIN["Dahili Temalar\n(dark, glass-modern,\nneon-purple, cyberpunk…)"]
        CUSTOM["Özel Tema\nengine.registerTheme()"]
        TM2["ThemeManager\n.setActive() / .getActive()"]
    end

    subgraph TOKEN_SYS["🪙 Token Sistemi"]
        RAW["Ham Token'lar\n{ accent.primary: '#7c3aed' }"]
        TE2["TokenEngine\n.resolve() / .defineBatch()"]
        RESOLVED["Resolve Edilmiş\nToken Haritası"]
    end

    subgraph STYLE_SYS["💅 Stil Sistemi"]
        SE2["StyleEngine\n.compute(layout, theme, tokens)"]
        STYLES["Computed Styles\n{ background, text, border... }"]
    end

    RENDERER["🖌️ CanvasRenderer\n(bileşenlere aktarılır)"]

    BUILTIN --> TM2
    CUSTOM --> TM2
    TM2 -->|"themeToTokens(name)"| RAW
    RAW --> TE2
    TE2 --> RESOLVED
    RESOLVED --> SE2
    SE2 --> STYLES
    STYLES --> RENDERER
```

---

## 6. Builder → Engine → Pipeline Çağrı Zinciri

Kullanıcının `new RankCard()` ile başladığı akıştan `Buffer` döndürülmesine kadar tam zincir:

```mermaid
sequenceDiagram
    participant U as Kullanıcı
    participant B as RankCard (Builder)
    participant E as Engine
    participant RP as RenderPipeline
    participant TM as ThemeManager
    participant TE as TokenEngine
    participant AL as AssetLoader
    participant CR as ComponentRegistry
    participant CV as CanvasRenderer

    U->>B: new RankCard()
    U->>B: .setUsername("Ataberk")
    U->>B: .setAvatar(url)
    U->>B: .setXP(750, 1000)
    U->>B: .setTheme("glass-modern")
    U->>B: .render()

    B->>E: engine.render(layout, data, options)
    E->>RP: RenderPipeline.execute(engine, layout, data, options)

    RP->>RP: stepLayoutResolve → koordinatlar hesaplandı
    RP->>TM: getActive() → "glass-modern"
    RP->>TE: resolve(themeTokens + data) → tokenlar birleştirildi
    RP->>AL: load(avatar_url) → önbellekten / URL'den yüklendi
    RP->>CR: get("rank-card") → CardRenderer sınıfı
    RP->>CV: createContext(800, 400, dpi)
    RP->>CV: component.render(ctx, bounds, styles, tokens)
    RP->>CV: applyEffect(effects)
    RP->>CV: bufferManager.encode("png")

    CV-->>U: Buffer<PNG>
```

---

## 7. Bileşen Ağacı (Component Registry)

`ComponentRegistry`, tüm çizilebilir bileşenleri isimle depolar. `RenderPipeline`, layout ağacındaki her node için ilgili bileşen sınıfını registry'den alır.

```mermaid
graph TD
    REG["🗂️ ComponentRegistry"]

    REG --> UI["UI Bileşenleri"]
    REG --> CARD["Kart Kontrolcüleri"]

    UI --> T["text\n→ TextComponent"]
    UI --> AV["avatar\n→ AvatarComponent"]
    UI --> PR["progress\n→ ProgressComponent"]
    UI --> ME["media / image / album-art / banner\n→ MediaComponent"]
    UI --> CO["container / box / level-box / stat-box\n→ ContainerComponent"]

    CARD --> RK["rank-card → CardRenderer"]
    CARD --> MU["music-card → CardRenderer"]
    CARD --> LB["leaderboard-card → CardRenderer"]
    CARD --> IV["invite-card → CardRenderer"]
    CARD --> PF["profile-card → CardRenderer"]
    CARD --> WL["welcome-card → CardRenderer"]
```

---

## 8. Plugin & Hook Sistemi

Plugin'ler ve Hook'lar, render döngüsünün belirli noktalarına müdahale etmenizi sağlar.

```mermaid
flowchart LR
    subgraph HOOKS["⚓ Hook Noktaları"]
        H1["preLayout"]
        H2["postLayout"]
        H3["beforeRender"]
        H4["beforeComponent"]
        H5["afterComponent"]
        H6["afterRender"]
    end

    subgraph PIPELINE2["RenderPipeline"]
        S1[Faz 1: Layout] -->|preLayout / postLayout| H1 & H2
        S5[Faz 5: Pre-Render] --> H3
        S6[Faz 6: Render] -->|her bileşen| H4 & H5
        S8[Faz 8: Post-Render] --> H6
    end

    USER2["engine.onHook('beforeRender', fn)"]
    PLUGIN["engine.use(myPlugin)"]

    USER2 -->|kayıt| HOOKS
    PLUGIN -->|PluginManager| HOOKS
```

---

## 9. Önbellek Mimarisi

`LRUCache`, tekrarlayan avatar URL'lerini ve fontları bellekte tutar; gereksiz ağ isteklerini önler.

```mermaid
flowchart LR
    AL2["AssetLoader\n.load(url)"]
    CACHE["LRUCache\n(LRU — Least Recently Used)"]
    NET["🌐 HTTP / Disk"]

    AL2 -->|"cache.get(url)"| CACHE
    CACHE -->|"HIT: mevcut"| AL2
    CACHE -->|"MISS: yok"| NET
    NET -->|"görsel yüklendi"| CACHE
    CACHE -->|"cache.set(url, buffer)"| AL2
```

- **Varsayılan davranış**: Aynı avatar URL'si birden fazla kez render edildiğinde yalnızca ilk seferinde indirilir.
- **Temizleme**: `engine.clearCache()` ile tamamen sıfırlanabilir.
- **İstatistik**: `engine.getCacheStats()` → `{ size, maxSize }`

---

## 10. Tasarım Prensipleri

```mermaid
mindmap
  root)@osn/modular Tasarım(
    Veri Odaklı
      Temalar çizmez, token sağlar
      Builder'lar stil bilmez, veri organize eder
      Layout bağımsızdır, pozisyonu açıklar
    Modülerlik
      Her alt sistem bağımsız değiştirilebilir
      Plugin API ile genişletilebilir
      Hook'larla müdahale noktaları açık
    Performans
      LRU önbellekleme
      Paralel asset yükleme
      Lazy Builder yükleme
    Geliştirici Deneyimi
      Fluent Builder API
      Standart DSL layout formatı
      Ayrıntılı hata mesajları
```

---

## Sonraki Adımlar

- [Render Pipeline Detayları →](./render-pipeline.md)
- [Builder API →](./builders.md)
- [Tema Sistemi →](./themes.md)
- [Özel Tema Oluşturma →](../guides/creating-custom-theme.md)
- [Performans Kılavuzu →](../guides/performance.md)
