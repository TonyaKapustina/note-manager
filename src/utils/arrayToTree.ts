import {DirectoryType} from "../interfaces/directories";

const arrayToTree = (array: DirectoryType[] = []) => {
    const map = {};
    const roots = [];
    let node, i;
    if (!array.length) {
        return []
    } else {
        for (i = 0; i < array.length; i += 1) {
            map[array[i].id] = i; // initialize the map
            array[i].children = []; // initialize the children
            array[i].path = [];
        }
        for (i = 0; i < array.length; i += 1) {
            node = array[i];
            if (node.parentId) {
                array[map[node.parentId]]?.children.push(node);
                array[map[node.id]].path = [...array[map[node.parentId]].path, node.id?.toString()];
            } else {
                array[map[node.id]].path.push(node.id?.toString());
                roots.push(node);
            }
        }
        return roots;
    }
};

export default arrayToTree;