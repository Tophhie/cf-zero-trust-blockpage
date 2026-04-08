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
		class="fixed bottom-6 right-6 bg-purple-700 hover:bg-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
		style="cursor: pointer;"
		onclick={goToSupportWebsite}
		aria-label="Go to support website"
		title="Go to support website"
	>
		<i class="fa fa-ticket fa-2x"></i>
	</button>
	{/if}

	<div class="flex flex-col p-6 space-y-6">
		<div class="bg-white shadow-xl rounded-2xl max-w-lg w-full p-10 space-y-6 text-black text-center">
			<img
				src={Config.HEADER_LOGO_URL}
				height="100"
				alt="Tophhie Cloud Logo"
				id="Logo"
				class="mx-auto w-45 h-auto"
			/>
			<div>
				<h1 class="text-xl font-bold" style="padding-bottom: 12pt;">{Config.BLOCKED_HEADER}</h1>
				<i class="fa fa-ban" style="font-size:80px; color: #B91C1C;"></i>
			</div>
			{#if siteUrl}
			<div class="border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
				<div class="bg-gray-50 px-4 py-3 text-left">
					<p class="text-red-700 font-bold break-all">{siteUrl}</p>
				</div>
			</div>
			{/if}
			<p>
				{#if metadataAvailable}
				{Config.BLOCKED_TEXT}
				{:else}
				{Config.BLOCKED_TEXT_NOMETA}
				{/if}
			</p>
			{#if metadataAvailable}
			<button class="block w-full px-3 py-1.5 text-sm text-gray-700 rounded transition-colors flex items-center justify-center gap-1" style="cursor: pointer;" onclick={showAdditionalInfo}>
				{detailButtonTxt}
				<i class="fa {showAddInfo ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
			</button>

			<button class="block w-full px-3 py-1.5 text-sm bg-[#100235] hover:bg-indigo-900 text-white font-bold rounded-3xl transition-colors whitespace-nowrap" style="cursor: pointer;"
				onclick={sendBlockedRequestEmail}
			>
				{Config.CONTACT_BUTTON_TXT}
			</button>
			{/if}
		</div>

		<!-- Additional Information Box -->
		{#if showAddInfo}
			<div class="bg-white shadow-xl rounded-2xl max-w-lg w-full p-6 space-y-6 text-black text-sm" transition:slide={{ duration: 500, easing: cubicOut }}>
			<dl class="space-y-2 text-left">
				{#each rows as [label, value]}
				<div class="sm:flex sm:justify-between">
					<dt class="font-semibold text-gray-700 sm:w-32 sm:whitespace-nowrap">{label}:</dt>
					<dd class="text-gray-900 break-all sm:text-right">{value}</dd>
				</div>
				{/each}
			</dl>
			</div>

		{/if}
	</div>
</div>
