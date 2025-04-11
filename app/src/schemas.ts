import { z } from "zod";

const Mora = z.object({
    phoneme: z.string(), 
    hira: z.string(),
    accent: z.number()
});

export const SynthesisParam = z.object({
    volumeScale: z.number(),
    pitchScale:  z.number(),
    intonationScale:  z.number(),
    prePhonemeLength:  z.number(),
    postPhonemeLength:  z.number(),
    outputSamplingRate:  z.number(),
    sampledIntervalValue:  z.number().optional(),
    adjustedF0: z.array(z.number()).optional(),
    processingAlgorithm: z.string().optional(),
    startTrimBuffer: z.number(),
    endTrimBuffer: z.number(),
    pauseLength: z.number().optional(),
    pauseStartTrimBuffer: z.number(),
    pauseEndTrimBuffer: z.number(),
    speakerUuid: z.string(),
    styleId: z.number(),
    text: z.string(),
    prosodyDetail: z.array(z.array(Mora)).optional(),
    speedScale: z.number(),
    outputPath: z.string().optional().describe("Path to save the synthesized WAV file"),
  })

export const SpeakersParam = z.object({})
