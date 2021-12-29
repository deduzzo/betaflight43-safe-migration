<script>
	// cd public && npm run build && vercel deploy && vercel --prod
	import {Snackbar, MaterialApp, Button, Card, CardText} from 'svelte-materialify';
	import { safeCommands, unsafeCommands, unsafeSections} from './stores'
	import 'codemirror/mode/python/python'
	import CodeMirror from "./index"
	import OptionSection from "./OptionSection.svelte";
	let editor;
	let backup = "# -- paste results of 'diff all' here --\n\n"
	let _otherSectionsAndSectionsEnder = ['profile', 'batch']
	let snackbar = false;
	let snackTest = ""

	const filterBackup = () => {

		let _safeCommands, _unsafeCommands, _unsafeSections
		safeCommands.subscribe(value => {
			_safeCommands = value;
		});
		unsafeCommands.subscribe(value => {
			_unsafeCommands = value;
		});
		unsafeSections.subscribe(value => {
			_unsafeSections = value;
		});

		let out = "# STARTING PROCESS ";
		let unsafeCount = 0;
		backup = editor.getValue();
		if (backup.length === 0)
			snackTest = "Nothing to analyze"
		else {
			let backupRows = backup.split('\n')
			let weAreInUnSafeSection = false;
			for (let row of backupRows)
			{
				let _originalRow = row;
				row = row.toLowerCase().trim().replace("set ","");
				if (!weAreInUnSafeSection)
				{
					if (_unsafeSections.some(command => row.startsWith(command)))
						weAreInUnSafeSection = true;
				}
				else {
					if (_otherSectionsAndSectionsEnder.some(command => row.startsWith(command)))
						if (!_unsafeSections.some(command => row.startsWith(command)))
							weAreInUnSafeSection = false;
				}
				if (row.length) {
					let safe = null;
					if (row.startsWith('#')) // safe
						safe = true;
					else {
						let findForSafeCommands = _safeCommands.some(command => row.startsWith(command))
						let findForUnSafeCommands = _unsafeCommands.some(command => row.startsWith(command))
						if (findForUnSafeCommands)
							safe = false;
						else if (findForSafeCommands)
							safe = true;
					}
					if (safe && !weAreInUnSafeSection)
						safe = true;
					if ((safe || safe === null) && !weAreInUnSafeSection)
						out = out + "\n" + _originalRow + (safe ? (!row.startsWith('#') ?" #SAFE" :"") : " #TO_CHECK (maybe safe)")
					else if (!safe || weAreInUnSafeSection) {
						out += "\n" + (!row.startsWith('#') ? ("# " + _originalRow + " #UNSAFE" + (weAreInUnSafeSection ? "_SECTION" : "") + " !!") : _originalRow)
						unsafeCount++;
					}
				}
				else out += "\n"
			}
			editor.setValue(out)
			navigator.clipboard.writeText(out);
			snackTest = "Completed! "+ unsafeCount +" unsafe rows detected. Results copied to your clipboard."
		}
		snackbar = true;
	}
	const options = {
		mode: "python",
		lineNumbers: true,
		value: backup,
	}
</script>

<svelte:head>
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-3303696-10"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'UA-3303696-10');
	</script>
	<title>Betaflight 4.3 safe Migrator - from @deduzzo -</title>
</svelte:head>
<MaterialApp>
	<Snackbar class="flex-column" bind:active={snackbar} bottom center timeout={2000}>
		{snackTest}
	</Snackbar>
	<div class="pa-4">
		<div class="d-flex justify-center ma-5"><h3>Betaflight 4.3 CLI Migrator v.0.11</h3></div>
		<div class="d-flex justify-center ma-5">
			<CodeMirror bind:editor {options} class="editor" />
		</div>
		<div class="d-flex justify-center ma-5">
			<Button class="d-flex flex-row" on:click={filterBackup}>Get BetaFlight 4.3 safe diff</Button>
		</div>
		<Card class="d-flex justify-center ma-5 pa-6" >
			<div class="">
				<span class="text-overline">settings</span>
			</div>
			<CardText>
				<OptionSection type="safeCommands" />
				<OptionSection type="unsafeCommands"/>
				<OptionSection type="unsafeSections"/>
			</CardText>
		</Card>
		<div class="d-flex justify-center ma-5" style="font-size: 12px">DISCLAIMER: with the use of this tool everyone is required to MANUAL verification of the result produced. Given the variety of quads and flight controllers it is possible that the results produced are not 100% perfect. This tool gives an indication, and is to be considered as a work in progress. The creators DO NOT assume any responsibility for any malfunction, product damage or problem that may occur after its use.</div>
		<div class="d-flex justify-center ma-5">Source on: <a href="https://github.com/deduzzo/betaflight43-safe-migration"> Github @deduzzo</a> </div>
	</div>
</MaterialApp>

<style>
	:global(.editor) {
		font-size: 0.8rem;
		width: 800px;
	}
</style>
