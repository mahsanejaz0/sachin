import clone from 'clone';
import PropTypes from 'prop-types';
import React from 'react'
import { AnimatedTree } from 'react-tree-graph';
import { setActiveNode } from 'app/redux/reducers/actions';
import './style.css';
import { useDispatch } from 'react-redux';




const TreeContainer = (props) => {
	const dispatch = useDispatch(); // Get the dispatch function from the Redux store

	function handleClick(event, node) {
		props.setActiveNode(node);
	}
	
	function getRoot(json) {
		if (json.name === props.activeNode) {
			return json;
		}

		for (let i = 0; i < json.children?.length; i++) {
			const childJson = getRoot(json.children[i]);
			if (childJson) {
				return childJson;
			}
		}

		return false;
	}

	function buildSubTree(root) {
		let newChildren = [];

		for (let i = 0; i < root.children?.length; i++) {
			const child = buildSubTree(root.children[i]);
			if (child) {
				newChildren.push(child);
			}
		}

		if (newChildren.length > 0) {
			root.children = newChildren;
		}

		if (newChildren.length > 0 || root.name.toLowerCase().indexOf(props.filter.toLowerCase()) !== -1) {
			return root;
		}

		return null;
	}

	function setClassName(node) {
		node.children?.forEach(setClassName);

		if (!props.filter) {
			return;
		}

		node.className = node.name.toLowerCase().indexOf(props.filter) === -1
			? 'node searchExcluded'
			: 'node searchIncluded';
	}

	let root = props.activeNode ? getRoot(props.data) : props.data;

	root = clone(root);

	if (props.filter) {
		root = buildSubTree(root) || root;
	}

	setClassName(root);

	return (
		<main>
			<AnimatedTree
				data={root}
				height={props.height}
				width={props.width}
				gProps={{
					className: 'node',
					onClick: handleClick
				}}
				textProps={{
					dy: 3.5
				}}
				steps={30}/>
		</main>
	);
}

export default TreeContainer