<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<script lang="ts">
	import { page } from "$app/state";
	import { cubicOut } from "svelte/easing";
	import { Config } from "../config";
    import { slide } from 'svelte/transition';

    $: showAddInfo = false;

    // Extract query params
    $: userEmail = page.url.searchParams.get("cf_user_email") ?? null;
    $: siteUrl = page.url.searchParams.get("cf_site_uri") ?? null;
    $: categories = page.url.searchParams.getAll("cf_request_category_names");
    $: referer = page.url.searchParams.get("cf_referer") ?? null;
    $: ruleId = page.url.searchParams.get("cf_rule_id") ?? null;
    $: sourceIp = page.url.searchParams.get("cf_source_ip") ?? null;
    $: deviceId = page.url.searchParams.get("cf_device_id") ?? null;
    $: appNames = page.url.searchParams.get("cf_application_name") ?? null;
    $: filter = page.url.searchParams.get("cf_filter") ?? null;
    $: accountId = page.url.searchParams.get("cf_account_id") ?? null;
    $: queryId = page.url.searchParams.get("cf_query_id") ?? null;
    $: connId = page.url.searchParams.get("cf_connection_id") ?? null;
    $: reqId = page.url.searchParams.get("cf_request_id") ?? null;

    // Build label/value pairs
    $: rawRows = [
        ["User Email", userEmail],
        ["Site", siteUrl],
        ["Categories", categories.length ? categories.join(", ") : null], // join multiple categories
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
    ];

    // Filter out empty/null values
    $: rows = rawRows.filter(([_, v]) => v !== null && String(v).trim() !== "");


    function showAdditionalInfo() {
        showAddInfo = !showAddInfo
    }


    function sendBlockedRequestEmail(): void {
        const subject = "Cloudflare Zero Trust - Blocked Request";

        // Build body from key:value pairs
        const body = rows
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");

        // Encode subject and body for URI
        const mailtoLink = `mailto:${Config.CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open mail client
        window.location.href = mailtoLink;
    }

    function goToSupportWebsite(): void {
        if (Config.CONTACT_WEB != null || undefined) {
            window.location.href = Config.CONTACT_WEB
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
        <i class=" fa fa-solid fa-ticket fa-2x"></i>
    </button>
    {/if}

    <div class="flex flex-col p-6 space-y-6">
        <div class="bg-white shadow-xl rounded-2xl max-w-lg w-full p-10 space-y-6 text-black text-center">
            <img
                src="https://blob.tophhie.cloud/tophhiecloud-resources/Logos/tophhiecloud-colour-padded.png"
                height="100"
                alt="Tophhie Social Logo"
                id="Logo"
                class="mx-auto w-28 md:w-44 h-auto"
            />
            <div>
                <h1 class="text-xl font-bold">Access restricted!</h1>
            </div>
            {#if siteUrl}
            <div>
                <p><strong>Site:</strong> <em>{siteUrl}</em></p>
            </div>
            {/if}
            <p>
                Access to this website has been restricted. Use the contact button below to request access.
            </p>
            {#if rows.length > 0}
            <button class="block w-full px-3 py-1.5 text-sm text-gray-700 rounded transition-colors" style="cursor: pointer;" onclick={showAdditionalInfo}>
                Show Details
            </button>

            <button class="block w-full px-3 py-1.5 text-sm bg-[#100235] hover:bg-indigo-900 text-white font-bold rounded-3xl transition-colors whitespace-nowrap"
                onclick={sendBlockedRequestEmail}
            >
                Request Access
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