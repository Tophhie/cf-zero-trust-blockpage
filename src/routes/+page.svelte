<script lang="ts">
	import { page } from '$app/state';
	import { cubicOut } from 'svelte/easing';
	import { Config } from '../config';
	import { slide } from 'svelte/transition';

	let showAddInfo = $state(false);
	let detailButtonTxt = $derived(showAddInfo ? 'Hide Info' : 'More Info');

	// Extract query params
	let userEmail = $derived(page.url.searchParams.get('cf_user_email'));
	let siteUrl = $derived(page.url.searchParams.get('cf_site_uri'));
	let categories = $derived(page.url.searchParams.getAll('cf_request_category_names'));
	let referer = $derived(page.url.searchParams.get('cf_referer'));
	let ruleId = $derived(page.url.searchParams.get('cf_rule_id'));
	let sourceIp = $derived(page.url.searchParams.get('cf_source_ip'));
	let deviceId = $derived(page.url.searchParams.get('cf_device_id'));
	let appNames = $derived(page.url.searchParams.get('cf_application_names'));
	let filter = $derived(page.url.searchParams.get('cf_filter'));
	let accountId = $derived(page.url.searchParams.get('cf_account_id'));
	let queryId = $derived(page.url.searchParams.get('cf_query_id'));
	let connId = $derived(page.url.searchParams.get('cf_connection_id'));
	let reqId = $derived(page.url.searchParams.get('cf_request_id'));

	// Build label/value pairs
	let rawRows: [string, string | null][] = $derived([
		['Date/Time', new Date().toLocaleString()],
		['User Email', userEmail],
		['Site', siteUrl],
		['Categories', categories.length ? categories.join(', ') : null],
		['Referer', referer],
		['Rule ID', ruleId],
		['Source IP', sourceIp],
		['Device ID', deviceId],
		['App', appNames],
		['Filter', filter],
		['Account ID', accountId],
		['Query ID', queryId],
		['Connection ID', connId],
		['Request ID', reqId]
	]);

	// Filter out empty/null values
	let rows = $derived(rawRows.filter(([, v]) => v !== null && String(v).trim() !== ''));

	// Whether meaningful metadata (beyond Date/Time) is available
	let metadataAvailable = $derived(
		rows.length > 0 && rows.some(([label]) => label !== 'Date/Time')
	);

	function showAdditionalInfo() {
		showAddInfo = !showAddInfo;
	}

	function sendBlockedRequestEmail(): void {
		const subject = 'Cloudflare Zero Trust - Blocked Request';
		const body = rows.map(([key, value]) => `${key}: ${value}`).join('\n');
		const mailtoLink = `mailto:${Config.CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		window.location.href = mailtoLink;
	}

	function goToSupportWebsite(): void {
		if (Config.CONTACT_WEB) {
			window.location.href = Config.CONTACT_WEB;
		}
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
	/>
</svelte:head>

<!-- Glass Modal (block state) — Tophhie Cloud design system.
     Anatomy: .tc-bg-illustration (on <body>) → .tc-glass-modal-stage →
     .tc-glass-modal.tc-modal-in with logo + status icon + title + body. -->
<div class="tc-glass-modal-stage">
	<div class="tc-glass-modal tc-modal-in">
		<img class="tc-glass-modal-logo" src={Config.HEADER_LOGO_URL} alt="Tophhie Cloud" id="Logo" />

		<div>
			<i class="fa fa-ban tc-glass-modal-icon tc-glass-modal-icon--danger" aria-hidden="true"></i>
			<h1 class="tc-glass-modal-title">{Config.BLOCKED_HEADER}</h1>
		</div>

		{#if siteUrl}
			<div class="blocked-url">
				<p>{siteUrl}</p>
			</div>
		{/if}

		<p class="tc-glass-modal-body">
			{#if metadataAvailable}
				{Config.BLOCKED_TEXT}
			{:else}
				{Config.BLOCKED_TEXT_NOMETA}
			{/if}
		</p>

		{#if metadataAvailable}
			<div class="blocked-actions">
				<button class="more-info-toggle" onclick={showAdditionalInfo}>
					{detailButtonTxt}
					<i class="fa {showAddInfo ? 'fa-chevron-up' : 'fa-chevron-down'}" aria-hidden="true"></i>
				</button>

				<!-- Additional Information — inline within the card -->
				{#if showAddInfo}
					<div transition:slide={{ duration: 500, easing: cubicOut }}>
						<hr class="more-info-divider" />
						<dl class="detail-list">
							{#each rows as [label, value] (label)}
								<div class="detail-row">
									<dt>{label}:</dt>
									<dd>{value}</dd>
								</div>
							{/each}
						</dl>
					</div>
				{/if}

				<button class="tc-btn tc-btn-primary request-access-btn" onclick={sendBlockedRequestEmail}>
					{Config.CONTACT_BUTTON_TXT}
				</button>
			</div>
		{/if}
	</div>
</div>

{#if Config.CONTACT_WEB}
	<button
		class="tc-glass-fab"
		onclick={goToSupportWebsite}
		aria-label="Go to support website"
		title="Go to support website"
	>
		<i class="fa fa-ticket" aria-hidden="true"></i>
	</button>
{/if}

<style>
	/* Blocked destination URL — a technical string, so it reads in mono
	   inside a frosted sub-panel that echoes the glass card. */
	.blocked-url {
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-2xl);
		overflow: hidden;
	}
	.blocked-url p {
		margin: 0;
		background: rgba(255, 255, 255, 0.1);
		padding: 12px 16px;
		color: var(--red-text);
		font-family: var(--mono);
		font-size: 13px;
		font-weight: 600;
		text-align: center;
		word-break: break-all;
	}

	/* Actions group — sits as a single gap-24 child of the glass modal,
	   with its own tighter internal rhythm. */
	.blocked-actions {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.more-info-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		width: 100%;
		padding: 6px 12px;
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		color: var(--text);
		font-family: var(--sans);
		font-size: 13px;
		cursor: pointer;
		transition: color var(--duration-fast) var(--ease-out);
	}
	.more-info-toggle:hover {
		color: var(--text-hi);
	}

	.more-info-divider {
		height: 1px;
		margin: 0;
		border: 0;
		background: var(--border);
	}

	.detail-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 16px;
		text-align: left;
		font-size: 13px;
	}
	.detail-row {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.detail-row dt {
		font-family: var(--sans);
		font-weight: 600;
		color: var(--text-dim);
	}
	.detail-row dd {
		margin: 0;
		font-family: var(--mono);
		font-size: 12px;
		color: var(--text);
		word-break: break-all;
	}

	@media (min-width: 640px) {
		.detail-row {
			flex-direction: row;
			justify-content: space-between;
			gap: 12px;
		}
		.detail-row dt {
			min-width: 8rem;
			white-space: nowrap;
		}
		.detail-row dd {
			text-align: right;
		}
	}

	/* Full-width pink primary CTA (design system: confirming action). */
	.request-access-btn {
		width: 100%;
		justify-content: center;
		padding: 10px 16px;
		font-size: 14px;
		font-weight: 600;
	}
</style>
