<script>
	export let data;
	export let subjectId;
	export let subject = data.subject;

	console.log(data);
</script>

<h1>
	{(subject && subject.metadata && subject.metadata.title) || subject.url}
</h1>

Hello from followup
