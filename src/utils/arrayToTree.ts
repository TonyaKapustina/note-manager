import {DirectoryType} from "../interfaces/directories";

const arrayToTree = (array: DirectoryType[] = []): DirectoryType[] => {
    const map: { [key: number]: number } = {}; // Use a mapping from id to index
    const roots: DirectoryType[] = [];
    let node: DirectoryType, i: number;

    if (!array.length) {
        return [];
    } else {
        for (i = 0; i < array.length; i += 1) {
            map[array[i].id] = i; // Initialize the map
            array[i].children = []; // Initialize the children
            array[i].path = [];
        }

        for (i = 0; i < array.length; i += 1) {
            node = array[i];
            if (node.parentId !== undefined && map[node.parentId] !== undefined) {
                const parentNode = array[map[node.parentId]]; // Explicitly access the parent node
                if (parentNode?.children) {
                    parentNode.children.push(node);
                    array[map[node.id]].path = [...(parentNode.path || []), node.id.toString()];
                }
            } else {
                array[map[node.id]]?.path?.push(node.id.toString());
                roots.push(node);
            }
        }
        return roots;
    }
};


export default arrayToTree;