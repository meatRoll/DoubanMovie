<template>
	<div>
		hello world
	</div>
</template>

<script>
import {jsonp} from '../assets/js/common.js';

export default {
	created(){
		jsonp('/us_box').then(res=>{
			console.log(res)
		});
	},
	data() {
		return {
		}
	}
}
</script>