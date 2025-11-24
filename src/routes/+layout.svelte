<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Cloudflare Zero Trust - Blocked Request</title>
	<meta name="theme-color" content="#100235" >
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
</svelte:head>

{@render children()}
