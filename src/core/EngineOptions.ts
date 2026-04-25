export type CacheOptions = {
    maxSize?: number;
    ttl?: number;
};

export type RendererOptions = {
    dpi?: number;
    maxPoolSize?: number;
};

export type EngineOptions = {
    dpi?: number;
    debug?: boolean;
    cache?: CacheOptions;
    renderer?: RendererOptions;
} & Record<string, unknown>;

