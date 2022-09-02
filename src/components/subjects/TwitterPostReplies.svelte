<script>
	export let posts = [];
</script>

<div class="accordion open" id="post-accordian">
	{#each posts as post}
		<div class="accordion-item">
			<h2 class="accordion-header" id={`post-header-${post.id}`}>
				<button
					class="accordion-button collapsed"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target={`#post-${post.id}`}
					aria-expanded="false"
					aria-controls={`post-${post.id}`}
				>
					{post.data.title}
				</button>
			</h2>
			<div
				id={`post-${post.id}`}
				class="accordion-collapse collapse"
				aria-labelledby={`post-header-${post.id}`}
				data-bs-parent="#post-accordian"
			>
				<div class="accordion-body">
					<strong>This is the first item's accordion body.</strong> It is shown by default, until
					the collapse plugin adds the appropriate classes that we use to style each element. These
					classes control the overall appearance, as well as the showing and hiding via CSS
					transitions. You can modify any of this with custom CSS or overriding our default
					variables. It's also worth noting that just about any HTML can go within the
					<code>.accordion-body</code>, though the transition does limit overflow.
				</div>
			</div>
		</div>
	{/each}
</div>
