export interface Photo {
	i: number;
	or: "H" | "V";
	nTags: number;
	tags: string[];
}
export interface Slide {
	[i: number]: Photo;
}
