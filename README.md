<h1 align="center"><b>CodeRev</b></h1>
CodeRev is an intelligent, AI-powered code review assistant designed to help developers of all skill levels improve their code. It acts as both a rigorous technical auditor and a friendly mentor, providing deep insights, security checks, and educational explanations.

![CodeRev Dashboard Mockup](https://github.com/user-attachments/assets/0d40ae11-08e0-4bd6-af26-ed8b7e679447) 

## ✨ Features

- **🤖 AI-Powered Analysis**: Powered by Google's **Gemini 2.5 Flash** (via OpenAI SDK) for lightning-fast and accurate code evaluations.
- **📊 Comprehensive Scoring System**: Instantly grade your code on four critical dimensions:
  - **Bug Risk**: Identifies logical errors and stability issues.
  - **Security**: Detects hardcoded secrets, injection vulnerabilities, and unsafe patterns.
  - **Code Quality**: Evaluates readability, DRY principles, and naming conventions.
  - **Maintainability**: Checks for modularity and structural organization.
- **🌗 Dual Explanation Modes**:
  - **Beginner Mode**: Friendly, analogy-based explanations (e.g., explaining API security like "house keys").
  - **Expert Mode**: Precise, technical feedback for experienced engineers.
- **📂 Flexible Input**:
  - **Paste Code**: Direct analysis of snippets.
  - **GitHub Repos**: Clone and review the latest commit of any public repository automatically.
- **🔒 Secure**: Fully integrated authentication via **Clerk**.
- **🎨 Modern UI**: Built with **Next.js**, **Tailwind CSS**, and **Shadcn UI** for a premium, responsive experience.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Auth**: [Clerk](https://clerk.com/)
- **AI Model**: [Google Gemini](https://deepmind.google/technologies/gemini/) (using OpenAI Node SDK)
- **Git Integration**: `simple-git`
- **Deployed on**: [Vercel](https://vercel.com/) 

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Google Cloud API Key (for Gemini)
- A Clerk Publishable Key & Secret Key

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/debangshu919/coderev.git
    cd coderev
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    GEMINI_API_KEY=your_google_gemini_key
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

### Scoring System
Visual feedback with color-coded severity:
- **Green (>80%)**: Great
- **Yellow (30-80%)**: Needs Attention
- **Red (<30%)**: Critical / High Risk

### Beginner vs Expert Mode
Toggle between "Simple Explanations" and "Technical Details" instantly.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](https://github.com/debangshu919/coderev/blob/main/LICENSE).
