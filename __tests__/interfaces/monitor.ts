export default interface Monitor<TClass> {
    onBeforeCall(): void;
    onAfterCall(): void;
}