<script>
  import AmpEnv from './lib/AmpEnv.svelte';
  import Efx from './lib/Efx.svelte';
  import OscKnobOne from './lib/OscKnobOne.svelte';
  import OscKnobTwo from './lib/OscKnobTwo.svelte';
  import PlayButton from './lib/PlayButton.svelte';
  import WaveDisplayOne from './lib/WaveDisplayOne.svelte';
  import WaveDisplayTwo from './lib/WaveDisplayTwo.svelte';
  import WaveSelectOne from './lib/WaveSelectOne.svelte';
  import WaveSelectTwo from './lib/WaveSelectTwo.svelte';
</script>

<main>
  <body>
    <div class="grid h-screen place-items-center">
      <div>
        <h1 class="text-2xl font-black">シンセパンク</h1>
      </div>
      <div
        id="synth"
        class="grid grid-cols-3 grid-rows-1 gap-0 border-2 border-black divide-x-2 divide-black  bg-primary-500 border-box"
      >
        <div id="oscGroup" class="grid grid-flow-col grid-rows-3">
          <!-- OSC 1 -->
          <div
            id="oscOne"
            class="grid grid-flow-col grid-rows-4 gap-0 place-content-evenly"
          >
            <h2 class="self-center font-bold text-center underline uppercase">
              osc - 1
            </h2>
            <!-- Waveform Display -->
            <WaveDisplayOne/>
            <!-- Waveform Select -->
            <WaveSelectOne/>
            <!-- Knobs -->
            <OscKnobOne/>
          </div>

          <!-- OSC 2 -->
          <div
            id="oscTwo"
            class="grid grid-flow-col grid-rows-4 row-start-2 gap-0  place-content-evenly"
          >
            <h2 class="self-center font-bold text-center underline uppercase">
              osc - 2
            </h2>
            <!-- Waveform Display -->
            <WaveDisplayTwo/>
            <!-- Waveform Select -->
            <WaveSelectTwo/>
            <!-- Knobs -->
            <OscKnobTwo/>
          </div>
          <!-- Play-Stop Button -->
        <PlayButton />
        </div>
        <AmpEnv/>
        <Efx/>
      </div>
    </div>
  </body>
</main>

<style>
body {
  background-color: #7D7461;
}

</style>
