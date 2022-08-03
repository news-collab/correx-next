<script>
	import { session } from '$app/stores';
	console.log('session', JSON.stringify($session));
</script>

{JSON.stringify($session.user)}
