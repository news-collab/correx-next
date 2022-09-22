<script>
  import { onMount, afterUpdate, beforeUpdate, tick } from 'svelte';
  import FaSortDown from 'svelte-icons/fa/FaSortDown.svelte';
  import FaSortUp from 'svelte-icons/fa/FaSortUp.svelte';
  import TiArrowSortedDown from 'svelte-icons/ti/TiArrowSortedDown.svelte';
  import TiArrowSortedUp from 'svelte-icons/ti/TiArrowSortedUp.svelte';

  export let items = [];
  export let attributes = {};
  export let selectables = [];
  export let selected = [];
  export let onClick = function () {};
  export let onSelect = function () {};
  export let sort = {
    attribute: undefined,
    direction: 'descending'
  };
  export let activeIcon = undefined;
  export let activeItem = undefined;

  function sortBy(attribute, direction) {
    if (!direction) {
      // if sortBy is clicked on the same attribute, reverse the sort order.
      if (attribute == sort.attribute) {
        direction = sort.direction == 'ascending' ? 'descending' : 'ascending';
      } else {
        // if the attribute is different, but the direction isn't set, set it.
        direction = 'descending';
      }
    }

    sort = {
      attribute,
      direction
    };

    function comparatorFor(prop, dir) {
      return function (a, b) {
        let returnValue;
        if (a.item[prop] > b.item[prop]) {
          returnValue = 1;
        } else if (a.item[prop] < b.item[prop]) {
          returnValue = -1;
        } else {
          returnValue = 0;
        }
        if (dir == 'descending') {
          returnValue = -returnValue;
        }
        return returnValue;
      };
    }

    selectables = selectables.sort(comparatorFor(sort.attribute, sort.direction));
  }

  onMount(async () => {
    await tick();
    selectables = items.map((item) => {
      return { checked: item.checked, item: item, active: false };
    });

    sortBy(Object.keys(attributes)[0], 'descending');
    if (activeItem !== undefined) {
      if (selectables[activeItem]) {
        selectables[activeItem].active = true;
      }
    }
  });

  function clicked(item) {
    update();
    onSelect(item);
  }

  function handleClick(selectable) {
    selectables.forEach((selectable) => {
      selectable.active = false;
    });
    selectable.active = true;
    selectables = selectables;
    onClick(selectable);
  }

  function update() {
    selected = selectables.filter((s) => s.checked).map((s) => s.item);
  }

  function handleSort(attribute, name) {
    sortBy(attribute);
  }
</script>

<table>
  {#if selectables.length > 0}
    <thead>
      <tr>
        <th />
        {#each Object.entries(attributes) as [attribute, name]}
          <th on:click={handleSort(attribute, name)}>
            <div class="sort-attribute">
              <div class="attribute">{name}</div>
              {#if sort.attribute == attribute}
                <div class="icon">
                  {#if sort.direction == 'ascending'}
                    <TiArrowSortedUp />
                  {:else}
                    <TiArrowSortedDown />
                  {/if}
                </div>
              {/if}
            </div>
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each selectables as selectable, index (selectable)}
        <tr
          class:selected={selectable.checked}
          class:alternate-color={!selectable.checked && index % 2 != 0}
        >
          <td
            on:click={() => {
              selectable.checked = !selectable.checked;
              clicked(selectable);
            }}><input type="checkbox" bind:checked={selectable.checked} /></td
          >
          {#each Object.entries(attributes) as [key, name] (key)}
            <td
              on:click={() => {
                selectable.checked = !selectable.checked;
                clicked(selectable);
              }}>{selectable.item[key] === undefined ? '' : selectable.item[key]}</td
            >
          {/each}
          <td on:click={handleClick(selectable)}>
            {#if activeIcon !== undefined && selectable.active}
              <div class="active-icon">
                <div class="icon">
                  <svelte:component this={activeIcon} />
                </div>
              </div>
            {:else}
              <span class="link">show</span>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  {:else}
    <p>This list has no items.</p>
  {/if}
</table>

<style>
  th img {
    height: 16px;
    width: 16px;
  }

  .alternate-color {
    background-color: #f8f8f8;
  }

  .selected {
    background-color: lightblue;
  }

  tbody tr:hover:not(.selected) {
    cursor: pointer;
  }

  tbody tr:hover {
    background-color: lightblue;
  }

  table {
    border-spacing: 0;
  }

  th {
    padding: 0px 16px;
    cursor: pointer;
    font-weight: bold;
    min-width: 120px;
  }

  th:hover {
    background-color: azure;
  }

  td {
    text-align: center;
  }

  span.link {
    text-decoration: underline;
  }

  /*
  .icon-wrapper {
    padding-top: 8px;
  }

  .icon-wrapper img {
    height: 18px;
    width: 18px;
    margin: 4px;
  }
  */

  .sort-attribute {
    display: flex;
  }

  .active-icon {
    display: flex;
    justify-content: flex-end;
  }

  .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
  }
</style>
