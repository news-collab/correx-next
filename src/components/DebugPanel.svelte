<script>
  export let dump = function() {  };
</script>

<footer>
  <button on:click={() => dump()}>dump</button>
  <div class="display">
    <slot></slot>
  </div>
</footer>

<style>
  footer {
    position: absolute;
    bottom: 0;
    height: 200px;
    width: 100%;
    background-color: rgba(0,0,0,0.5)
  }

  div.display {
    margin: 20px;
    background-color: white;
  }
</style>