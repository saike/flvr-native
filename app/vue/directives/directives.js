import Vue from "nativescript-vue";
import { setInterval, clearInterval } from 'tns-core-modules/timer';

Vue.directive('classToggler', {
  // Когда привязанный элемент вставлен в DOM...
  inserted: function (el, binding, vnode) {

    let interval_time = parseInt(el.getAttribute('interval') || 3000);
    let changed_class = binding.expression || '';
    
    vnode.interval = setInterval(() => {

      let class_list = el.getAttribute('class').split(' ');
      let class_index = class_list.indexOf(changed_class);
      if(class_index < 0) {

        class_list.push(changed_class);

      }
      else {

        class_list.splice(class_index, 1);

      }

      el.setAttribute('class', class_list.join(' '));  

    }, interval_time);
  },
  unbind: function(el, binding, vnode) {
    
    clearInterval(vnode.interval); 

  }
})