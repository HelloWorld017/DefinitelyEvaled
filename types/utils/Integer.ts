export type TypeInteger = string;

export type AddOne<A extends TypeInteger> =
	A extends `${infer B}0` ? `${B}1` :
	A extends `${infer B}1` ? `${B}2` :
	A extends `${infer B}2` ? `${B}3` :
	A extends `${infer B}3` ? `${B}4` :
	A extends `${infer B}4` ? `${B}5` :
	A extends `${infer B}5` ? `${B}6` :
	A extends `${infer B}6` ? `${B}7` :
	A extends `${infer B}7` ? `${B}8` :
	A extends `${infer B}8` ? `${B}9` :
	A extends `${infer B}9` ? `${AddOne<B>}0` :
	`1${A}`;

export type SubtractOne<A extends TypeInteger> =
	A extends '1' ? '0' : SubtractOneInternal<A>;

type SubtractOneInternal<A extends TypeInteger> =
	A extends `${infer B}1` ? `${B}` :
	A extends `${infer B}2` ? `${B}1` :
	A extends `${infer B}3` ? `${B}2` :
	A extends `${infer B}4` ? `${B}3` :
	A extends `${infer B}5` ? `${B}4` :
	A extends `${infer B}6` ? `${B}5` :
	A extends `${infer B}7` ? `${B}6` :
	A extends `${infer B}8` ? `${B}7` :
	A extends `${infer B}9` ? `${B}8` :
	A extends `${infer B}0` ? `${SubtractOneInternal<B>}9` :
	never;
