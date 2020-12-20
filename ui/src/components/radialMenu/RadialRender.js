import React, { useLayoutEffect, useRef, useState } from "react";
import getPoints from "./get-points"
const rChildClass = "react-radial-render-child";

function RChild(props) {
	return (
		<div
			className={rChildClass}
			style={{
				position: "absolute",
				top: `${props.top}px`,
				left: `${props.left}px`,
			}}
		>
			{props.children}
		</div>
	);
}

function RadialRender(props) {
	const containerRef = useRef();
	const childArray = React.Children.toArray(props.children);

	const { points, leastX, leastY, greatestX, greatestY } = getPoints(
		props.r,
		childArray.length
	);

	useLayoutEffect(() => {
		const container = containerRef.current;
		let rightBounds = 0;
		let bottomBounds = 0;

		const childNodes = container.getElementsByClassName(rChildClass);

		for (let i = 0; i < childNodes.length; i++) {
			const child = childNodes[i];
			const [left, top] = [
				parseInt(child.style.left.replace("px", "")),
				parseInt(child.style.top.replace("px", "")),
			];

			if (left == greatestX - leastX) {
				rightBounds = left + child.offsetWidth + leastX;
			}

			if (top == greatestY - leastY) {
				bottomBounds = top + child.offsetHeight + leastY;
			}
		}

		container.style.width = rightBounds - leastX + "px";
		container.style.height = bottomBounds - leastY + "px";
	});

	return (
		<div
			ref={containerRef}
			className="radial-render-container"
			style={{ margin: "0", padding: "0", position: "relative" }}
		>
			{points.map((point, i) => (
				<RChild
					key={props.genKey ? props.genKey() : `radial-render-${i}`}
					top={point.y - leastY}
					left={point.x - leastX}
				>
					{childArray[i]}
				</RChild>
			))}
		</div>
	);
}


export default RadialRender;