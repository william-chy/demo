import Vue from 'vue';
export default Vue.component('config-component', {
  props: [ 'value' ],
  on: {
    input: function(value) {
      this.$emit('change', value);
    },
  },
  render: function(createElement) {
    var self = this;
    return createElement('input', {
      domProps: {
        value: self.value,
      },
      on: {
        input: function(event) {
          self.$emit('input', event.target.value);
        },
      },
    });
  },
});
