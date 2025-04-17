import { z } from "zod";

export const SynthesisParam = z.object({
    pitchScale:  z.number().min(-1.5).max(1.5),
    intonationScale:  z.number().min(0).max(2.0),
    prePhonemeLength:  z.number().min(0).optional(),
    postPhonemeLength:  z.number().min(0).optional(),
    speakerUuid: z.string(),
    styleId: z.number(),
    text: z.string(),
    speedScale: z.number().min(0.5).max(2.0),
    outputFileName: z.string().optional().describe("The synthesized WAV filesave as outputFileName. ex: example.wav "),
  })

export const SpeakersParam = z.object({})
