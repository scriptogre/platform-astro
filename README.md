
## Authentication

### Overview
We chose htmx. Unlike client-side frameworks, it handles everything server-side.

### Benefits
It aligns with Astro's philosophy:
- **Server-first**: Moves expensive rendering off of your visitors’ devices.
- **Zero JS, by default**: Less client-side JavaScript to slow your site down.

We use htmx to eliminate client-side data fetching and JavaScript-dependent DOM manipulation, fully leveraging Astro's Static Site Generation (SSG). This integration allows for dynamic content without the heavy use of client-side JavaScript, except for the lightweight htmx ([~14k min.gz’d](https://unpkg.com/htmx.org/dist/)).

### Examples

#### Displaying User Profile Picture or Login Button
1. Inside our top navigation bar, we include a div with the following attributes:
    ```html
    <div hx-get="/user_or_login/" hx-trigger="load"></div>
    ```
    - `hx-get="/user_or_login/"` indicates the AJAX call to the server-side rendered (SSR) partial page found at `/src/pages/user_or_login.astro`.
    - `hx-trigger="load"` indicates that the AJAX call is made when the page loads.

2. We mark the page at `/src/pages/user_or_login.astro` with `export const prerender = false`, indicating to Astro that it is suitable for SSR.

3. We check the user's authentication status in `user_or_login.astro`, and render the appropriate content.
   - Logged-in User: If the user is authenticated, it retrieves the user's profile picture.
   - Not Logged-in: For unauthenticated users, it displays the login button.

4. The request returns the complete HTML, already populated with the user's profile picture or login button, which replaces the div in the top navigation bar.
5. We use [CSS animations](https://htmx.org/examples/animations/) or [View Transitions](https://htmx.org/essays/view-transitions/) to make this change more visually appealing.

References:
- [Astro Server-Side Rendering](https://docs.astro.build/en/guides/server-side-rendering/)
- [hx-get](https://htmx.org/attributes/hx-get/)
- [hx-trigger](https://htmx.org/attributes/hx-trigger/)
- [Related Discussion on Reddit](https://www.reddit.com/r/htmx/comments/15g6weg/composing_with_hxtriggerload_and_hxget_is_it_a/)

#### Logging In
1. If the user was not authenticated, the login button is displayed:
    ```html
   <LoginButton hx-get="/auth/login/"
                hx-target="body"
                hx-swap="beforeend" />
    ```
    - The page at `/src/pages/auth/login.astro` is a partial (not a whole page) which only includes a `<Modal>` component with the login form.
    - `hx-get="/auth/login/"` indicates the AJAX call to the SSR partial page found at `/src/pages/auth/signin.astro`.
    - `hx-target="body"` and `hx-swap="beforeend"` indicate that the response should be appended to the end of the body.

2. The user enters their credentials and submits the form.
3. The request returns the complete HTML, already populated with the user's profile picture or login button, which replaces the div in the top navigation bar.

## Notes
- This projects always has `trailingSlash: "always"` in `astro.config.mjs`. Ensure you include them, otherwise you'll get 404.

*This is because of an issue where `Astro.url.pathname` was inconsistent between dev and build, which caused issues in `<SideNav>` component. https://github.com/withastro/astro/issues/4638*

- Inside HTMX partial pages that are SSR, the typical `redirect()` function does not work. 
  - Instead, use the `redirectWithHtmx()` function, which uses `HX-Redirect` header to do a full page client redirect. 
  - For more information, see https://htmx.org/reference/#response_headers

- Most of the auth logic has been moved into `auth.ts`. 
  - This might cause some abstractions seeming redundant, but this choice was to keep the code consistent and organized. 
  - This also enables easily swapping the auth logic with a different provider (e.g. Auth0), without having to modify the `.astro` files too much.
  - What the `.astro` files do is to call functions from `auth.ts`, handle redirects and display the appropriate content / error messages.