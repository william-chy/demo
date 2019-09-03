const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [ ...arr ];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};
const generateItems = (count, creator) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(creator(i));
  }
  return result;
};

require('./index.scss');
const indexTpl = require('./index.xtpl');

import { Container, Draggable } from 'vue-smooth-dnd';
import anchoredHeading from './component/view-component';
import configComponent from './component/config-component';
export default {
  name: 'Copy',
  template: indexTpl,
  components: { Container, Draggable, anchoredHeading, configComponent },
  data() {
    return {
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
      items1: generateItems(5, (i) => ({
        id: '1' + i,
        data: `组件 - ${i}`,
        showDelete: false,
      })),
      items2: {},
      currentEdit: '',
    };
  },
  methods: {
    onDrop(collection, dropResult) {
      console.log(collection);
      console.log(dropResult);
      this[collection] = applyDrag(this[collection], dropResult);
    },
    getChildPayload1(index) {
      return this.items1[index];
    },
    getChildPayload2(index) {
      return this.items2[index];
    },
    deleteComponent(i) {
      this.items2.splice(i, 1);
    },
  },
};
