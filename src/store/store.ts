import { ref } from 'vue';

const STORE = ref(Object.create({}));

// watch(STORE, (curr, prev) => {
// 	console.log('[changed]: ', curr, prev);
// }, { deep: true });

export {
	STORE,
};
