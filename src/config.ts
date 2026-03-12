export class Config {
    /**
     * Header logo
     */
    static readonly HEADER_LOGO_URL: string = "https://public-blob.tophhie.cloud/logos/tophhiecloud-colour-padded.png";

    /**
     * The contact support email address.
     */
    static readonly CONTACT_EMAIL: string = "help@tophhie.cloud";

    /**
     * The contact support website.
     */
    static readonly CONTACT_WEB: string = "https://support.tophhie.cloud";

    /**
     * Block page header text
     */
    static readonly BLOCKED_HEADER: string = "You can't access this destination!";

    /**
     * Block page detail text (if Cloudflare metadata is provided)
     */
    static readonly BLOCKED_TEXT: string = "Access to this webpage has been blocked. Please contact support or request access if you believe this is a mistake.";

    /**
     * Block page detail text (if no Cloudflare metadata is provided)
     */
    static readonly BLOCKED_TEXT_NOMETA = "Access has been restricted. No website information has been supplied.";

    /**
     * Contact email button text
     */
    static readonly CONTACT_BUTTON_TXT: string = "Request Access";
}