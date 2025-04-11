import { client } from "@/api/v1/client.js";
import { SpeakersParam, SynthesisParam } from "@/schemas.js";
import { FastMCP, UserError } from "fastmcp";
import * as fs from "fs";
import * as path from "path";

// Create a new FastMCP server
const server = new FastMCP({
    name: "coeiroink-mcp-server",
    version: "1.0.0",
});

// Add a tool to synthesize voice using COEIROINK
server.addTool({
    name: "synthesize_voice",
    description: "Synthesize voice using COEIROINK",
    parameters: SynthesisParam,
    execute: async (args, { log }) => {
        try {
            log.info("Synthesizing voice...", {
                text: args.text,
                speaker: args.speakerUuid,
            });

            const { data } = await client.POST("/v1/synthesis", {
                headers: {
                    accept: "audio/wav",
                },
                body: {
                    volumeScale: args.volumeScale,
                    pitchScale: args.pitchScale,
                    intonationScale: args.intonationScale,
                    prePhonemeLength: args.prePhonemeLength,
                    postPhonemeLength: args.postPhonemeLength,
                    outputSamplingRate: args.outputSamplingRate,
                    startTrimBuffer: args.startTrimBuffer,
                    endTrimBuffer: args.endTrimBuffer,
                    pauseStartTrimBuffer: args.pauseStartTrimBuffer,
                    pauseEndTrimBuffer: args.pauseEndTrimBuffer,
                    speakerUuid: args.speakerUuid,
                    styleId: args.styleId,
                    text: args.text,
                    speedScale: args.speedScale,
                },
            });

            // WAVデータをファイルに保存
            if (args.outputPath && data) {
                try {
                    // 出力ディレクトリが存在しない場合は作成
                    const outputDir = path.dirname(args.outputPath);
                    if (!fs.existsSync(outputDir)) {
                        fs.mkdirSync(outputDir, { recursive: true });
                    }

                    // WAVデータをファイルに書き込み
                    fs.writeFileSync(args.outputPath, Buffer.from(data));
                    log.info(`Voice saved to ${args.outputPath}`);
                } catch (saveError) {
                    log.error(
                        `Failed to save voice to file: ${
                            saveError instanceof Error
                                ? saveError.message
                                : String(saveError)
                        }`
                    );
                }
            }

            log.info("Voice synthesis completed");

            return {
                content: [
                    {
                        type: "text",
                        text: `Voice synthesized successfully for text: "${
                            args.text
                        }" using speaker: ${args.speakerUuid}. ${
                            args.outputPath
                                ? `Saved to: ${args.outputPath}`
                                : ""
                        }`,
                    },
                ],
            };
        } catch (error) {
            throw new UserError(
                `Failed to synthesize voice: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        }
    },
});

// Add a tool to list available speakers
server.addTool({
    name: "list_speakers",
    description: "List all available COEIROINK speakers",
    parameters: SpeakersParam,
    execute: async (_, { log }) => {
        try {
            log.info("Fetching available speakers...");

            const { data } = await client
                .GET("/v1/speakers")
                .then(({ data, ...rest }) => {
                    const _data = data?.map(
                        ({ base64Portrait, styles, ...rest }) => {
                            return {
                                styles: styles.map(
                                    ({
                                        base64Icon,
                                        base64Portrait,
                                        ...style
                                    }) => style
                                ),
                                ...rest,
                            };
                        }
                    );
                    return {
                        data: _data,
                        ...rest,
                    };
                });

            log.info("Speakers fetched successfully");

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        } catch (error) {
            throw new UserError(
                `Failed to list speakers: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        }
    },
});

// Start the server
server.start({
    transportType: "stdio",
});
