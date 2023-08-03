// @ts-nocheck
const arrayToTree = (array = []) => {
    // eslint-disable-next-line prefer-const
    let map = {}, node, roots = [], i;
    if (!array.length) {
        return []
    } else {
        for (i = 0; i < array.length; i += 1) {
            map[array[i].id] = i; // initialize the map
            array[i].children = []; // initialize the children
            array[i].path = [];
            array[i].childrensId = [];
        }
        for (i = 0; i < array.length; i += 1) {
            node = array[i];
            if (node.parentId) {
                array[map[node.parentId]]?.children.push(node);
                array[map[node.id]].path = [...array[map[node.parentId]].path, node.id?.toString()];
                // array[map[node.parentId]].childrensId = [...array[map[node.parentId]].childrensId, node.id?.toString()];
            } else {
                array[map[node.id]].path.push(node.id?.toString());
                roots.push(node);
            }
        }
        return roots;
    }
};

export default arrayToTree;