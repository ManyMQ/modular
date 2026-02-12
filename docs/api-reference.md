# API Reference

## createEngine(options)

Create a new engine instance.

```typescript
function createEngine(options?: EngineOptions): Engine
interface EngineOptions {
  dpi?: number;
  cache?: { maxSize: number };
  debug?: boolean;
}
```

## Engine Methods

| Method | Description |
|--------|-------------|
| `createRankCard()` | Create rank card builder |
| `createMusicCard()` | Create music player builder |
| `createLeaderboardCard()` | Create leaderboard builder |
| `createInviteCard()` | Create invite tracker builder |
| `createProfileCard()` | Create profile card builder |
| `createWelcomeCard()` | Create welcome card builder |

## CardBuilder Methods

All card builders support:

```typescript
card.setUser(user: Discord.User)
card.setGuild(guild: Discord.Guild)
card.setTheme(name: string)
card.setTokens(tokens: Record<string, any>)
card.toBuffer(): Promise<Buffer>
card.toStream(): Promise<Stream>
card.send(interaction): Promise<Message>
card.reply(interaction): Promise<Message>
card.followUp(interaction): Promise<Message>
```

## Theme System

```typescript
engine.themes.register(name: string, theme: Theme)
engine.themes.get(name: string): Theme
engine.themes.apply(name: string)
```

## Token System

```typescript
engine.tokens.set(key: string, value: any)
engine.tokens.get(key: string): any
card.tokens.set(key: string, value: any)
card.tokens.get(key: string): any
```

## Plugin System

```typescript
engine.plugins.register(plugin: Plugin)
engine.plugins.get(name: string): Plugin
engine.plugins.emit(event: string, ...args: any[])
```

## Component Registry

```typescript
engine.components.register(name: string, component: Component)
engine.components.get(name: string): Component
engine.components.override(name: string, component: Component)
```

## Rendering

```typescript
await card.render(): Promise<Buffer>
await card.renderAsync(): Promise<Buffer>
```

## Performance APIs

```typescript
engine.cache.clear()
engine.cache.getStats()
engine.pool.acquire()
engine.pool.release(canvas)
```
