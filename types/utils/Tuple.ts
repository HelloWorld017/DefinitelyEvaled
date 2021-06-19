export type FirstElement<T extends readonly unknown[]> =
	T[0] extends T[number] ? T[0] : never;

export type FirstRemainder<T extends readonly unknown[]> =
	T extends [unknown, ...infer Remainder] ?
		Remainder extends T ? Remainder : [] :
		never;

export type LastElement<T extends readonly unknown[]> =
	T[FirstRemainder<T>['length']];

export type LastRemainder<T extends readonly unknown[]> =
	T extends [...infer Remainder, unknown] ?
		Remainder :
		never;
