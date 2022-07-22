<script>
  export let state = false;
  export let disabled = false;
  let button;

  function toggle() {
    const currentState = button.getAttribute("aria-pressed") == "false";
    state = currentState ? true : false;
    button.setAttribute("aria-pressed", state);
  }
</script>

<!-- cribbed from  http://adrianroselli.com/2019/08/under-engineered-toggles-too.html -->

<form>
  <fieldset class="toggles">
    <div>
      <button
        bind:this={button}
        type="button"
        aria-pressed={state}
        {disabled}
        on:click|preventDefault={() => toggle()}
      >
        <slot />
      </button>
    </div>
  </fieldset>
</form>

<style>
  form {
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
  }

  fieldset {
    flex: 1 0 10em;
    border: none;
  }

  fieldset.toggles div {
    box-sizing: border-box;
    position: relative;
  }

  fieldset.toggles > div {
    margin: 1.5em 0;
  }

  fieldset.toggles > div:first-of-type {
    margin-top: 1em;
  }

  fieldset.toggles > div:last-of-type {
    margin-bottom: 1em;
  }

  .toggles [aria-pressed] {
    display: block;
    box-sizing: border-box;
    border: none;
    color: inherit;
    background: none;
    font: inherit;
    line-height: inherit;
    text-align: left;
    padding: 0.4em 0 0.4em 4em;
    /*   position: relative; */
  }

  .toggles [aria-pressed][disabled],
  .toggles [aria-pressed][disabled]:hover {
    color: #999;
  }

  .toggles [aria-pressed]:focus,
  .toggles [aria-pressed]:hover {
    color: #00f;
    outline: none;
  }

  .toggles [aria-pressed]:focus::before,
  .toggles [aria-pressed]:hover::before {
    box-shadow: 0 0 0.5em #333;
  }

  .toggles [aria-pressed]:focus::after,
  .toggles [aria-pressed]:hover::after {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='50' fill='rgba(0,0,0,.25)'/%3E%3C/svg%3E");
    background-size: 30%;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .toggles [aria-pressed]::before,
  .toggles [aria-pressed]::after {
    content: "";
    position: absolute;
    height: 1.5em;
    transition: all 0.25s ease;
  }

  .toggles [aria-pressed]::before {
    left: 0;
    top: 0.2em;
    width: 3em;
    border: 0.2em solid #767676;
    background: #767676;
    border-radius: 1.1em;
  }

  .toggles [aria-pressed]::after {
    left: 0;
    top: 0.25em;
    background-color: #fff;
    background-position: center center;
    border-radius: 50%;
    width: 1.5em;
    border: 0.15em solid #767676;
  }

  .toggles [aria-pressed="true"]::after {
    left: 1.6em;
    border-color: #36a829;
    color: #36a829;
  }

  .toggles [aria-pressed="true"]::before {
    background-color: #36a829;
    border-color: #36a829;
  }

  .toggles [aria-pressed][disabled]::before {
    background-color: transparent;
    border-color: #ddd;
  }

  .toggles [aria-pressed][disabled]::after {
    border-color: #ddd;
  }

  .toggles [aria-pressed][disabled]:hover {
    color: #999; /* case for CSS custom property if not supporting IE/Edge */
  }

  .toggles [aria-pressed][disabled]:hover::before {
    box-shadow: none;
  }

  .toggles [aria-pressed][disabled]:hover::after {
    background-image: none;
  }

  /* Put toggles on the right like the iOS the kids like */

  /*.toggles.flip [aria-pressed]::before,
  .toggles.flip [aria-pressed]::after {
    left: auto;
    right: 0;
  }*/

  /*.toggles.flip [aria-pressed]::after {
    left: auto;
    right: 1.6em;
  }*/

  /*.toggles.flip [aria-pressed="true"]::after {
    right: 0;
  }*/

  /*.toggles.flip [aria-pressed] {
  padding-left: 0;
  padding-right: 4em;
}*/

  /* Windows High Contrast Mode Support */
  @media screen and (-ms-high-contrast: active) {
    .toggles [aria-pressed]:focus::before,
    .toggles [aria-pressed]:hover::before {
      outline: 1px dotted windowText;
      outline-offset: 0.25em;
    }
    .toggles [aria-pressed]::after {
      background-color: windowText;
    }
    .toggles [aria-pressed][disabled]::after {
      background-color: transparent;
    }
  }

  /* Reduced motion */
  @media screen and (prefers-reduced-motion: reduce) {
    .toggles [aria-pressed]::before,
    .toggles [aria-pressed]::after {
      transition: none;
    }
  }

  /* Dark mode */
  /*
@media screen and (prefers-color-scheme: dark) {
  form {
    background-color: #101010;
  }
  .toggles {
    color: #fff;
  }
  fieldset.toggles {
    border: 0.1em solid rgba(255, 255, 255, 0.15);
  }
  .toggles [aria-pressed]:focus,
  .toggles [aria-pressed]:hover {
    color: #99f;
  }
  .toggles [aria-pressed]::before {
    border-color: #808080;
    background: #808080;
  }
  .toggles [aria-pressed]::after {
    background-color: #101010;
  }
  .toggles [aria-pressed]:focus::after,
  .toggles [aria-pressed]:hover::after {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='50' fill='rgba(255,255,255,.25)'/%3E%3C/svg%3E");
  }
  .toggles [aria-pressed][disabled]::before,
  .toggles [aria-pressed][disabled]::after {
    border-color: #555;
  }
}
*/

  /* Print styles */
  @media print {
    .toggles [aria-pressed]::before,
    .toggles [aria-pressed]::after,
    .toggles [aria-pressed][disabled] {
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
    }
  }
</style>
