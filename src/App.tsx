import { useCallback, useEffect, useState } from "react";
import words from "./wordsList.json";
import HangmanWord from "./HangmanWord.tsx";
import Keyboard from "./Keyboard.tsx";
import HangmanDrawing from "./HangmanDrawing.tsx";

function getWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function App() {
    const [wordToGuess, setWordToGuess] = useState(getWord);

    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

    const incorrectLetters = guessedLetters.filter(letter => {
        return !wordToGuess.includes(letter);
    });

    const isLoser = incorrectLetters.length >= 6;
    const isWinner = wordToGuess.split("").every(letter => {
        return guessedLetters.includes(letter);
    });

    const addGuessedLetter = useCallback(
        (letter: string) => {
            if (guessedLetters.includes(letter) || isLoser || isWinner) return;
            setGuessedLetters(prevGuessedLetters => [
                ...prevGuessedLetters,
                letter,
            ]);
        },
        [guessedLetters, isWinner, isLoser]
    );

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const key = e.key;

            if (!key.match(/^[a-z$]/)) return;

            e.preventDefault();
            addGuessedLetter(key);
        };

        document.addEventListener("keypress", handler);

        return () => {
            document.removeEventListener("keypress", handler);
        };
    }, [guessedLetters]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const key = e.key;

            if (key !== "Enter") return;

            e.preventDefault();
            setGuessedLetters([]);
            setWordToGuess(getWord());
        };

        document.addEventListener("keypress", handler);

        return () => {
            document.removeEventListener("keypress", handler);
        };
    }, []);

    return (
        <div
            style={{
                maxWidth: "800px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2rem",
                margin: "0 auto",
            }}
        >
            <div
                style={{
                    fontSize: "2rem",
                    textAlign: "center",
                }}
            >
                {isWinner && "Winner! - Refresh to play again"}
                {isLoser && "Nice try - Refresh to play again"}
            </div>

            <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
            <HangmanWord
                reveal={isLoser}
                guessedLetters={guessedLetters}
                wordToGuess={wordToGuess}
            />
            <div style={{ alignSelf: "stretch" }}>
                <Keyboard
                    disabled={isWinner || isLoser}
                    activeLetters={guessedLetters.filter(letter =>
                        wordToGuess.includes(letter)
                    )}
                    inactiveLetters={incorrectLetters}
                    addGuessedLetter={addGuessedLetter}
                />
            </div>
        </div>
    );
}

export default App;
