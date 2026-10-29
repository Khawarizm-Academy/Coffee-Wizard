<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Site copy lives in src/content/translations.ts (EN + AR, same shape) and menu items in src/content/menu.ts; components read via useLang() so both languages and RTL stay in sync.
- Prices are never rendered unless an item's priceStatus is "verified"; third-party prices are stored but treated as unconfirmed.
- Images are registered in src/content/images.ts with kind "authentic" or "illustrative"; illustrative ones must stay labelled on-site.
