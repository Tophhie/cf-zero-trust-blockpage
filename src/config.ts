export class Config {
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
    static readonly BLOCKED_HEADER: string = "Access restricted!";

    /**
     * Block page detail text (if Cloudflare metadata is provided)
     */
    static readonly BLOCKED_TEXT: string = "Access to this website has been restricted. Use the contact button below to request access.";

    /**
     * Block page detail text (if no Cloudflare metadata is provided)
     */
    static readonly BLOCKED_TEXT_NOMETA = "Access has been restricted. No website information has been supplied.";

    /**
     * Contact email button text
     */
    static readonly CONTACT_BUTTON_TXT: string = "Request Access";
}