<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<script lang="ts">
	import { page } from "$app/state";

    $: showAddInfo = false;

    $: queryParams = page.url.searchParams;

    $: userEmail = page.url.searchParams.get("cf_user_email") ?? null;
    $: siteUrl = page.url.searchParams.get("cf_site_uri") ?? null;
    $: categories = page.url.searchParams.get("cf_request_categories") ?? null;
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
        ["Categories", categories],
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

    // Only keep rows where value is not null/empty/whitespace
    $: rows = rawRows.filter(([_, v]) => v !== null && String(v).trim() !== "");

    function showAdditionalInfo() {
        showAddInfo = !showAddInfo
    }

</script>

<div class="min-h-screen bg-[#100235] text-gray-100 p-4 sm:p-6 md:p-8 lg:p-12">
    <div class="min-h-screen flex flex-col items-center justify-center p-6 space-y-6">
        <div class="bg-white shadow-xl rounded-2xl max-w-lg w-full p-10 space-y-6 text-black text-center">
            <img
                src="https://blob.tophhie.cloud/tophhiecloud-resources/Logos/tophhiecloud-colour-padded.png"
                height="100"
                alt="Tophhie Social Logo"
                id="Logo"
                class="h-8 sm:h-15 md:h-15 w-auto mb-4 sm:mb-6 mx-auto"
            />
            <div>
                <h1 class="text-xl font-bold">Access restricted!</h1>
            </div>
            {#if siteUrl}
            <div>
                <p><strong>Site:</strong> {siteUrl}</p>
            </div>
            {/if}
            <p>
                Access to this website has been restricted. Use the contact button below to request access.
            </p>

            <button class="block w-full px-3 py-1.5 text-sm text-gray-600 rounded transition-colors" style="cursor: pointer;" onclick={showAdditionalInfo}>
                Show More Info
            </button>

            <button class="block w-full px-3 py-1.5 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors whitespace-nowrap">
                Contact Network Administrator
            </button>

        </div>

        <!-- Additional Information Box -->
        {#if showAddInfo}
        <div class="bg-white shadow-xl rounded-2xl max-w-lg w-full p-6 space-y-6 text-black text-center text-sm">
            <dl class="space-y-2">
                {#each rows as [label, value]}
                <div class="flex justify-between">
                    <dt class="font-semibold text-gray-700">{label}:</dt>
                    <dd class="text-gray-900 break-all">{value}</dd>
                </div>
                {/each}
            </dl>
        </div>
        {/if}
    </div>
</div>
