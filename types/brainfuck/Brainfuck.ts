import type { AddOne, SubtractOne, TypeInteger } from '../utils/Integer';
import type { FirstElement, FirstRemainder } from '../utils/Tuple';

type MemoryBase = { [Key in TypeInteger]?: TypeInteger };
type MemoryGet<Memory extends MemoryBase, Pointer extends TypeInteger> =
	Memory[Pointer] extends TypeInteger ?
		Memory[Pointer] :
		'0';

type MemorySet<Memory extends MemoryBase, Pointer extends TypeInteger, Value extends TypeInteger> =
	{ [ K in keyof Memory | Pointer ]: K extends Pointer ? Value : Memory[K] };

export type DefaultEnv<Code extends string> =
	Env<[ Code ], {}, '0', ''>;

type Env<
	Stack extends readonly string[],
	Memory extends MemoryBase,
	Pointer extends TypeInteger,
	Output extends string
> = [ Stack, Memory, Pointer, Output];

type SkipChars = '\n' | '\t' | '\r' | ' ';

export type Interpret<E> = E extends Env<infer S, infer M, infer P, infer O> ?
	FirstElement<S> extends `+${infer Remainder}` ?
		InterpretAdd<Env<[ Remainder, ...FirstRemainder<S> ], M, P, O>> :

	FirstElement<S> extends `-${infer Remainder}` ?
		InterpretSub<Env<[ Remainder, ...FirstRemainder<S> ], M, P, O>> :

	FirstElement<S> extends `>${infer Remainder}` ?
		InterpretNext<Env<[ Remainder, ...FirstRemainder<S> ], M, P, O>> :

	FirstElement<S> extends `<${infer Remainder}` ?
		InterpretPrev<Env<[ Remainder, ...FirstRemainder<S> ], M, P, O>> :

	FirstElement<S> extends `[${infer Remainder}` ?
		InterpretLoopStart<Env<[ Remainder, ...FirstRemainder<S> ], M, P, O>> :

	FirstElement<S> extends `]${infer Remainder}` ?
		InterpretLoopEnd<Env<[ Remainder, ...FirstRemainder<S> ], M, P, O>> :

	FirstElement<S> extends `.${infer Remainder}` ?
		InterpretOutput<Env<[ Remainder, ...FirstRemainder<S> ], M, P, O>> :

	FirstElement<S> extends `${SkipChars}${infer Remainder}` ?
		Interpret<Env<[ Remainder, ...FirstRemainder<S> ], M, P, O>> :

	M :
	never;


type InterpretAdd<E> = E extends Env<infer S, infer M, infer P, infer O> ?
	Interpret<Env<S, MemorySet<M, P, AddOne<MemoryGet<M, P>>>, P, O>> :
	never;


type InterpretSub<E> = E extends Env<infer S, infer M, infer P, infer O> ?
	Interpret<Env<
		S,
		MemorySet<M, P, SubtractOne<MemoryGet<M, P>> extends never ? '255' : SubtractOne<MemoryGet<M, P>>>,
		P,
		O
	>> :
	never;

type InterpretNext<E> = E extends Env<infer S, infer M, infer P, infer O> ?
	Interpret<Env<
		S,
		M,
		AddOne<P>,
		O
	>> :
	never;

type InterpretPrev<E> = E extends Env<infer S, infer M, infer P, infer O> ?
	Interpret<Env<
		S,
		M,
		SubtractOne<P>,
		O
	>> :
	never;

type InterpretLoopStart<E> = E extends Env<infer S, infer M, infer P, infer O> ?
	Interpret<Env<
		[FirstElement<S>, ...S],
		M,
		P,
		O
	>> :
	never;

type InterpretLoopEnd<E> = E extends Env<infer S, infer M, infer P, infer O> ?
	MemoryGet<M, P> extends '0' ?
		Interpret<Env<
			[FirstElement<FirstRemainder<S>>, ...FirstRemainder<S>],
			M,
			P,
			O
		>> :

		Interpret<Env<
			[FirstElement<S>, ...FirstRemainder<FirstRemainder<S>>],
			M,
			P,
			O
		>> :
	never;

type InterpretOutput<E> = E extends Env<infer S, infer M, infer P, infer O> ?
	Interpret<Env<
		S,
		M,
		P,
		`${O}${MemoryGet<M, P>}`
	>> :
	never;

type Output = Interpret<DefaultEnv<`
	++++++++++
	[>+++++++>++++++++++>+++>+<<<<-]
	>++.>+.+++++++..+++.>++++++++++++++.------------.<<+++++++++++++++.>.+++.------.--------.>+.
`>>;
