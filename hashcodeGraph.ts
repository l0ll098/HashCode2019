import * as fs from "fs";
import { Photo, Slide } from "./types";
import { Graph, alg, json } from "@dagrejs/graphlib";

export enum Files {
	Example = "a.txt",
	A = "a.txt",
	B = "b.txt",
	C = "c.txt",
	D = "d.txt",
	E = "e.txt"
}
const curr = Files.C;

let count = 0;
let lastV: Photo = null;
let out = "";
let lastSlide: Slide = null;

const slidePicked: boolean[] = [];
const slideShow: Slide[] = [];
let bestSlideShow: Slide[] = [];
const ITERATIONS = 10;

const MAX_COMMON_TAGS = 100;
const graph = new Graph({
	directed: false
});


(async () => {
	// #region Input
	const data = fs.readFileSync("./in/" + curr).toString();

	const photos: Photo[] = [];

	const input = data.split("\n");
	const n = parseInt(input[0], 10);

	for (let i = 1; i <= n; ++i) {
		const parts = input[i].split(" ");
		const photo: Photo = {
			i: i - 1,
			or: parts[0].toUpperCase() === "H" ? "H" : "V",
			nTags: parseInt(parts[1], 10),
			tags: parts.slice(2, parts.length)
		};

		photos.push(photo);

		// Add a new node
		graph.setNode(photo.i);
	}
	//#endregion

	console.log("N = ", n);
	console.log("Creating edges...");

	photos.forEach((photo, index) => {
		const slide = getSlide(photo);

		// Add an edge between two nodes. (this is done for each node)
		photos.forEach((p2) => {
			if (photo.i !== p2.i) {
				graph.setEdge(photo.i, p2.i);
			}
		});

		if (!slide) {
			return;
		}

		lastSlide = slide;

	});

	console.log("All edges have been created!");

	// Path is an array of indexes (int) representing the shortest path
	const path: number[] = [];

	console.log("Prim...");
	const prim = alg.prim(graph, (e) => {
		const p1 = photos[parseInt(e.v, 10)];
		const p2 = photos[parseInt(e.w, 10)];

		const _points = calcPoint(p1, p2);
		return _points === 0 ? MAX_COMMON_TAGS + MAX_COMMON_TAGS + 1 : MAX_COMMON_TAGS - _points;
	});
	console.log("Prim ended!");

	console.log("Topological sort...");
	const topSorted: string[] = alg.topsort(prim);
	console.log("Topological sort ended!");

	// Reset count
	count = 0;

	console.log("Creating slideshow...");
	topSorted.forEach((v) => {
		const slide = getSlide(photos[parseInt(v, 10)]);
		if (slide) {
			slideShow.push(slide);
		}
	});
	bestSlideShow = slideShow;

	// console.log(slideShow);

	//#region Output

	// Print each slide in to the file
	bestSlideShow.forEach((slide) => {
		slideOut(slide);
	});

	out = count + "\n" + out;

	fs.writeFileSync("./out/" + curr, out);

	console.log("Done");

	//#endregion
})();

function getSlide(p: Photo): Slide {
	if (p.or === "V") {
		if (!lastV) {
			lastV = p;
			return null;
		} else {
			const copy = lastV;	// ref to lastV
			lastV = null;
			count++;
			return [copy, p];	// Vertical photos
		}
	} else {
		// Horizontal photo, add it
		count++;
		return [p];
	}
}

function slideOut(slide: Slide): void {
	out += slide[0].i;
	if (slide[1]) {
		out += " " + slide[1].i;
	}
	out += "\n";
}


function calcPoint(p1: Photo, p2: Photo) {
	// console.log(p1, p2);
	if (p1.or === "V" && p2.or === "V") {
		return 0;
	}

	const commonTags = p1.tags.filter((value) => -1 !== p2.tags.indexOf(value)).length;
	const p1NotP2 = p1.tags.filter((e) => !p2.tags.find((a) => e === a)).length;
	const p2NotP1 = p2.tags.filter((e) => !p1.tags.find((a) => e === a)).length;

	return Math.min(commonTags, p1NotP2, p2NotP1);
}
