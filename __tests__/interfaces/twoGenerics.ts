export interface TwoGenerics<T1, T2 extends T1> {
  main(): void;
}

export class TwoGenericsImpl<T1, T2 extends T1> implements TwoGenerics<T1, T2> {
  main(): void {
    return;
  }
}