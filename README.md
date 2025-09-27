# ADK Simple Agent

adk-simple-agent is a starter project for creating a simple adk agent.

## Installation

To install the dependencies, run the following command:

```bash
pnpm install
```

## Configuration

1.  Create a `.env` file by copying the example file:

    ```bash
    cp .env.example .env
    ```

2.  Edit the `.env` file and add your `GOOGLE_API_KEY`. You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Usage

You can run the agent in two modes:

### Chat Mode

This will start an interactive chat session with the agent.

```bash
pnpm chat
```

### Direct Question

You can ask a question directly from the command line.

```bash
pnpm start "Your question here"
```

## Development

### Development Mode

To run the agent in development mode with live reloading, use:

```bash
pnpm dev
```

### Build

To build the project for production, run:

```bash
pnpm build
```

The output will be in the `dist` directory.

### Clean

To remove the build artifacts, run:

```bash
pnpm clean
```

## License

This project is licensed under the MIT License.
