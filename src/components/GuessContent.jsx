"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import LevelSelector from "./LevelSelector";
import Image from "next/image";
import Nyawa from "./GuessNyawa";
import { motion } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";
import { useUser } from "@/utils/UserProvider";
import { BsQuestionLg } from "react-icons/bs";
import axios from "axios";

const GuessContent = () => {
  const { user, setUser } = useUser();
  const [dataSoal, setDataSoal] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [indexSoal, setIndexSoal] = useState(0);
  const [jawaban, setJawaban] = useState("");
  const [nyawa, setNyawa] = useState(user?.lives || 0);
  const [hint, setHint] = useState(user?.hint || 0);
  const [completedLevels, setCompletedLevels] = useState(
    user?.completedLevel || []
  );
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const completedLevelsFromStorage = JSON.parse(
        localStorage.getItem("completedLevels")
      );
      setCompletedLevels(completedLevelsFromStorage || []);
    }
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleJawabanChange = (e) => {
    setJawaban(e.target.value);
  };

  // handle nyawa

  const handleNyawaRecovered = async () => {
    try {
      const response = await axios.put(
        "/api/v1/users",
        {
          newScore: user.score,
          newLives: user.lives + 1,
          newHint: user.hint,
          newCompletedLevel: user.completedLevel,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setNyawa((currentNyawa) => currentNyawa + 1);
      setUser(response.data.response);
      localStorage.setItem("user", JSON.stringify(response.data.response));
      setCooldown(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Terjadi kesalahan saat mengupdate nyawa.",
        icon: "error",
      });
    }
  };

  const handleSelectLevel = (level) => {
    const currentLevelIndex = level;
    const previousLevelIndex = currentLevelIndex - 1;

    if (
      currentLevelIndex === 1 ||
      completedLevels.includes(previousLevelIndex) ||
      (user.completedLevel.includes(previousLevelIndex) && nyawa > 0)
    ) {
      const audio = new Audio("/sound/start.mp3");
      audio.play();
      setSelectedLevel(level);
      setDataSoal(require(`../utils/soal.json`)[level]);
      setIndexSoal(0);
      setNyawa(user.lives);
    } else if (nyawa === 0) {
      const audio = new Audio("/sound/wrong.mp3");
      audio.play();
      Swal.fire({
        title: "Nyawa Anda Habis",
        text: "Isi nyawa anda agar bisa bermain",
        icon: "error",
      });
    } else {
      const audio = new Audio("/sound/wrong.mp3");
      audio.play();
      Swal.fire({
        title: "Level ini terkunci",
        text: "Silakan selesaikan level sebelumnya",
        icon: "warning",
      });
    }
  };

  const handleCorrectAnswer = () => {
    const isLastQuestion = indexSoal === dataSoal.length - 1;
    if (
      jawaban.toLocaleLowerCase() ===
      dataSoal[indexSoal].jawaban.toLocaleLowerCase()
    ) {
      const audio = new Audio(
        isLastQuestion ? "/sound/win.mp3" : "/sound/right.mp3"
      );
      audio.play();
      Swal.fire({
        title: isLastQuestion ? "Selamat Anda Menang!" : "Benar!",
        imageUrl: isLastQuestion ? "/confetti.gif" : "/good.gif",
        imageHeight: "200",
        confirmButtonText: "Lanjut",
      }).then(() => {
        setJawaban("");
        setSelectedLevel(isLastQuestion ? null : selectedLevel);
        setIndexSoal((prevIndex) =>
          isLastQuestion ? prevIndex : prevIndex + 1
        );

        if (isLastQuestion && !completedLevels.includes(selectedLevel)) {
          const updatedLevels = [...completedLevels, selectedLevel];
          updateCompletedLevel(updatedLevels);
          setCompletedLevels(updatedLevels);
          localStorage.setItem(
            "completedLevels",
            JSON.stringify(updatedLevels)
          );
        }
      });
    } else {
      handleIncorrectAnswer();
    }
  };
  const updateCompletedLevel = async (updatedLevels) => {
    try {
      const response = await axios.put(
        "/api/v1/users",
        {
          newScore: user.score,
          newLives: user.lives,
          newHint: user.hint,
          newCompletedLevel: updatedLevels,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      // Update user data after successful API call
      setUser(response.data.response);

      // Update local storage
      localStorage.setItem("user", JSON.stringify(response.data.response));
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Terjadi kesalahan saat memperbarui completedLevel di server.",
        icon: "error",
      });
    }
  };

  const handleIncorrectAnswer = async () => {
    const audio = new Audio("/sound/wrong.mp3");
    audio.play();
    setNyawa((currentNyawa) => currentNyawa - 1);

    try {
      // Fix the API endpoint URL and payload
      const response = await axios.put(
        "/api/v1/users",
        {
          newScore: user.score, // Adjust field names based on your server's requirements
          newLives: user.lives - 1,
          newHint: user.hint,
          newCompletedLevel: user.completedLevel,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      // Update user data after successful API call
      setUser(response.data.response);

      // Update local storage
      localStorage.setItem("user", JSON.stringify(response.data.response));

      if (nyawa === 1) {
        Swal.fire({
          title: "Game Over!",
          imageUrl: "/GameOver.gif",
          imageHeight: "200",
          confirmButtonText: "Kembali",
        }).then(() => {
          setJawaban("");
          setSelectedLevel(null);
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Terjadi kesalahan saat mengupdate nyawa.",
        icon: "error",
      });
    }
  };

  // handle hint
  const handleHint = async () => {
    if (user.hint > 0) {
      setHint((currentHint) => currentHint - 1);
      const correctAnswer = dataSoal[indexSoal].jawaban.toLowerCase();

      // Create an array to represent the masked version of the correct answer
      const maskedAnswer = Array.from(correctAnswer, (char) =>
        char === " " ? " " : "_"
      );

      // Get the indices of characters to reveal as hints
      const hintIndices = [];
      for (let i = 0; i < Math.min(3, correctAnswer.length); i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * correctAnswer.length);
        } while (hintIndices.includes(randomIndex));
        hintIndices.push(randomIndex);
      }

      // Reveal the characters at the hint indices
      hintIndices.forEach((index) => {
        maskedAnswer[index] = correctAnswer[index];
      });

      // Display the masked answer as a hint
      Swal.fire({
        title: "Hint",
        html: `Jawaban yang benar: ${maskedAnswer
          .join(" ")
          .replace(/ /g, "&nbsp;")}`,
        icon: "info",
        confirmButtonText: "OK",
        showCloseButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      try {
        // Fix the API endpoint URL and payload
        const response = await axios.put(
          "/api/v1/users",
          {
            newScore: user.score,
            newLives: user.lives,
            newHint: user.hint - 1,
            newCompletedLevel: user.completedLevel,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        // Update user data after successful API call
        setUser(response.data.response);

        // Update local storage
        localStorage.setItem("user", JSON.stringify(response.data.response));
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "Terjadi kesalahan saat mengupdate hint.",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "Hint Habis",
        text: "Maaf, hint Anda sudah habis.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      {selectedLevel ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full min-h-screen flex justify-center items-center relative"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 absolute top-4 left-4 bg-[#20324E] text-white rounded-full flex place-items-center justify-center border-4 border-white"
            onClick={() => {
              setSelectedLevel(null);
              setJawaban("");
            }}
          >
            <IoIosArrowBack size={30} />
          </motion.button>
          <div className="bg-[#20324E] w-1/3 text-white h-full p-6 rounded">
            <div className="flex justify-between">
              <p className="font-semibold">Soal ke - {indexSoal + 1}</p>
              <Nyawa
                jumlahNyawa={nyawa}
                onNyawaRecovered={handleNyawaRecovered}
                cooldown={false}
                setCooldown={setCooldown}
              />
            </div>
            <h1 className="text-2xl font-bold mb-8 mt-2">
              Tebak Gambar Berikut Ini
            </h1>
            <div className="flex justify-center mb-8">
              <Image
                src={dataSoal[indexSoal].gambar}
                alt={`Tebak Gambar Soal Ke ${indexSoal}`}
                width={0}
                height={0}
                sizes="100vw"
                priority
                className="w-full h-auto rounded-md"
              />
            </div>
            <input
              type="text"
              name=""
              id=""
              value={jawaban}
              onChange={handleJawabanChange}
              placeholder="Ketik Jawaban Anda Disini..."
              className="w-full px-5 py-3 outline-none rounded-md text-black font-bold mb-4"
            />

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.9 }}
                className="w-full p-4 bg-blue-700 rounded font-bold duration-700 hover:bg-blue-600 relative z-10"
                onClick={handleCorrectAnswer}
              >
                Cek Jawaban
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 p-4 bg-orange-500 text-white rounded-full font-bold duration-700 hover:bg-orange-600 relative z-10"
                onClick={handleHint}
              >
                <BsQuestionLg size={35} />
                <div className="absolute -bottom-4 -right-4 bg-white text-orange-500 rounded-full w-10 h-10 flex items-center justify-center">
                  {user.hint}
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          <LevelSelector
            onSelectLevel={handleSelectLevel}
            completedLevels={completedLevels}
            jumlahNyawa={nyawa}
            cooldown={cooldown}
            setCooldown={setCooldown}
            handleNyawaRecovered={handleNyawaRecovered}
            onNyawaRecovered={handleNyawaRecovered}
          />
        </>
      )}
    </>
  );
};

export default GuessContent;
