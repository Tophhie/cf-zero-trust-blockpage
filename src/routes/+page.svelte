<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<script lang="ts">
	import { page } from "$app/state";
	import { cubicOut } from "svelte/easing";
	import { Config } from "../config";
	import { slide } from "svelte/transition";

	let showAddInfo = $state(false);
	let detailButtonTxt = $derived(showAddInfo ? "Hide Info" : "More Info");

	// Extract query params
	let userEmail = $derived(page.url.searchParams.get("cf_user_email"));
	let siteUrl = $derived(page.url.searchParams.get("cf_site_uri"));
	let categories = $derived(page.url.searchParams.getAll("cf_request_category_names"));
	let referer = $derived(page.url.searchParams.get("cf_referer"));
	let ruleId = $derived(page.url.searchParams.get("cf_rule_id"));
	let sourceIp = $derived(page.url.searchParams.get("cf_source_ip"));
	let deviceId = $derived(page.url.searchParams.get("cf_device_id"));
	let appNames = $derived(page.url.searchParams.get("cf_application_names"));
	let filter = $derived(page.url.searchParams.get("cf_filter"));
	let accountId = $derived(page.url.searchParams.get("cf_account_id"));
	let queryId = $derived(page.url.searchParams.get("cf_query_id"));
	let connId = $derived(page.url.searchParams.get("cf_connection_id"));
	let reqId = $derived(page.url.searchParams.get("cf_request_id"));

	// Build label/value pairs
	let rawRows: [string, string | null][] = $derived([
		["Date/Time", new Date().toLocaleString()],
		["User Email", userEmail],
		["Site", siteUrl],
		["Categories", categories.length ? categories.join(", ") : null],
		["Referer", referer],
		["Rule ID", ruleId],
		["Source IP", sourceIp],
		["Device ID", deviceId],
		["App", appNames],
		["Filter", filter],
		["Account ID", accountId],
		["Query ID", queryId],
		["Connection ID", connId],
		["Request ID", reqId]
	]);

	// Filter out empty/null values
	let rows = $derived(rawRows.filter(([_, v]) => v !== null && String(v).trim() !== ""));

	// Whether meaningful metadata (beyond Date/Time) is available
	let metadataAvailable = $derived(rows.length > 0 && rows.some(([label]) => label !== "Date/Time"));

	function showAdditionalInfo() {
		showAddInfo = !showAddInfo;
	}

	function sendBlockedRequestEmail(): void {
		const subject = "Cloudflare Zero Trust - Blocked Request";
		const body = rows.map(([key, value]) => `${key}: ${value}`).join("\n");
		const mailtoLink = `mailto:${Config.CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		window.location.href = mailtoLink;
	}

	function goToSupportWebsite(): void {
		if (Config.CONTACT_WEB) {
			window.location.href = Config.CONTACT_WEB;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center text-gray-100 p-4 sm:p-6 md:p-8 lg:p-12">

	{#if Config.CONTACT_WEB}
	<button
		class="fixed bottom-6 right-6 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
		style="cursor: pointer;"
		onclick={goToSupportWebsite}
		aria-label="Go to support website"
		title="Go to support website"
	>
		<i class="fa fa-ticket fa-2x"></i>
	</button>
	{/if}

	<div class="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl max-w-lg w-full p-10 space-y-6 text-gray-100 text-center">
		<img
			src={Config.HEADER_LOGO_URL}
			height="100"
			alt="Tophhie Cloud Logo"
			id="Logo"
			class="mx-auto w-45 h-auto"
		/>
		<div>
			<i class="fa fa-ban pb-3" style="font-size:80px; color: #F87171;"></i>
			<h1 class="text-xl font-bold">{Config.BLOCKED_HEADER}</h1>
		</div>
		{#if siteUrl}
		<div class="border border-white/20 rounded-3xl overflow-hidden">
			<div class="bg-white/10 px-4 py-3 text-center">
				<p class="text-red-400 font-bold break-all">{siteUrl}</p>
			</div>
		</div>
		{/if}
		<p class="text-gray-300">
			{#if metadataAvailable}
			{Config.BLOCKED_TEXT}
			{:else}
			{Config.BLOCKED_TEXT_NOMETA}
			{/if}
		</p>
		{#if metadataAvailable}
		<button class="block w-full px-3 py-1.5 text-sm text-gray-300 hover:text-white rounded transition-colors flex items-center justify-center gap-1" style="cursor: pointer;" onclick={showAdditionalInfo}>
			{detailButtonTxt}
			<i class="fa {showAddInfo ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
		</button>

		<!-- Additional Information — inline within the card -->
		{#if showAddInfo}
		<div transition:slide={{ duration: 500, easing: cubicOut }}>
			<hr class="border-white/20" />
			<dl class="space-y-2 text-left mt-4 text-sm">
				{#each rows as [label, value]}
				<div class="sm:flex sm:justify-between">
					<dt class="font-semibold text-gray-400 sm:w-32 sm:whitespace-nowrap">{label}:</dt>
					<dd class="text-gray-200 break-all sm:text-right">{value}</dd>
				</div>
				{/each}
			</dl>
		</div>
		{/if}

		<button class="block w-full px-3 py-1.5 text-sm bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-3xl transition-colors whitespace-nowrap" style="cursor: pointer;"
			onclick={sendBlockedRequestEmail}
		>
			{Config.CONTACT_BUTTON_TXT}
		</button>
		{/if}
	</div>
</div>
