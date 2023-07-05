const arrayToTree = (array) => {
    let map = {}, node, roots = [], i;
    if (!array.length) {
        return []
    } else {
        for (i = 0; i < array.length; i += 1) {
            map[array[i].id] = i; // initialize the map
            array[i].children = []; // initialize the children
        }
        for (i = 0; i < array.length; i += 1) {
            node = array[i];
            if (node.parentId) {
                array[map[node.parentId]].children.push(node);
            } else {
                roots.push(node);
            }
        }
        return roots;
    }
};

export default arrayToTree;