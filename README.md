# Cloudflare Zero Trust – Blocked Request Page

A simple **SvelteKit** application that displays a branded "Access Restricted" page when a request is blocked by Cloudflare Zero Trust. It provides users with contextual details about the blocked request and options to contact support.

---

## ✨ Features

- **Dynamic Request Details**  
  Automatically extracts Cloudflare query parameters (e.g., `cf_user_email`, `cf_site_uri`, `cf_rule_id`) and displays them in a clean UI.

- **Responsive Design**  
  Built with **TailwindCSS** for mobile-first responsiveness.

- **Support Actions**  
  - **Request Access**: Generates a `mailto:` link with all request details.
  - **Support Website**: Floating button linking to your support portal.

- **Animated UI**  
  Smooth **slide transition** for additional details using Svelte’s built-in transitions.

---

## 📂 Project Structure

```
src/
├── routes/
│   └── +page.svelte    # Main UI for blocked request page
├── config.ts           # Contact email and support URL configuration
```

---

## ⚙️ Configuration

Edit `config.ts` to set your support details:

```ts
export class Config {
    static readonly CONTACT_EMAIL: string = "help@tophhie.cloud";
    static readonly CONTACT_WEB: string = "https://support.tophhie.cloud";
}
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/tophhie/cf-zero-trust-blockpage.git
cd cf-zero-trust-blockpage
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

---

## 🔑 Environment Variables (Optional)
If you prefer dynamic configuration, you can replace `Config.ts` with environment variables:

```env
VITE_CONTACT_EMAIL=help@tophhie.cloud
VITE_CONTACT_WEB=https://support.tophhie.cloud
```

---

## 🖼️ UI Preview

- **Main Page**:  
  Displays logo, blocked message, and action buttons.
- **Details Panel**:  
  Slides open to show request metadata (IP, rule ID, device ID, etc.).

---

## 🛠️ Tech Stack

- https://kit.svelte.dev/
- https://tailwindcss.com/
- https://fontawesome.com/v4.7.0/icons/

---

## ✅ Example Query Parameters

The page reads Cloudflare query params like:

```
cf_user_email
cf_site_uri
cf_request_categories
cf_rule_id
cf_source_ip
cf_device_id
cf_application_name
cf_filter
cf_account_id
cf_query_id
cf_connection_id
cf_request_id
```

---

## 📬 Contact

For support, email help@tophhie.cloud.

---

### ✅ Future Enhancements
- Add **fade + slide combo** for details panel.
- Support **multi-language UI**.

---
