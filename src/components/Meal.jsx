import React, { useState, useEffect } from "react";

export default function Meal() {
  const [meal, setMeal] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // 🔴 error state

  const API_URL = "https://www.themealdb.com/api/json/v1/1";

  // 📌 Fetch a random meal
  const getMeal = async () => {
    try {
      setLoading(true);
      setError(""); // reset error
      const res = await fetch(`${API_URL}/random.php`);
      if (!res.ok) throw new Error("Failed to fetch random meal"); // check response
      const data = await res.json();
      setMeal(data.meals[0]);
    } catch (err) {
      console.error("Error fetching meal:", err);
      setError("Could not fetch a random meal. Please try again.");
      setMeal(null);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Search a meal by name
  const searchMeal = async () => {
    if (!search.trim()) {
      setError("Please enter a meal name.");
      return;
    }
    try {
      setLoading(true);
      setError(""); // reset error
      const res = await fetch(`${API_URL}/search.php?s=${search}`);
      if (!res.ok) throw new Error("Failed to fetch meal");
      const data = await res.json();
      if (!data.meals) {
        setError("No meals found for that name.");
        setMeal(null);
      } else {
        setMeal(data.meals[0]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Something went wrong while searching. Try again.");
      setMeal(null);
    } finally {
      setLoading(false);
      setSearch("");
    }
  };

  // 📌 Run once when component mounts
  useEffect(() => {
    getMeal();
  }, []);

  // 📌 Extract ingredients + measures
  const getIngredients = (meal) => {
    let items = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim() !== "") {
        items.push(`${measure} ${ing}`);
      }
    }
    return items;
  };

  // 📌 Allow Enter key to trigger search
  const handleKey = (e) => {
    if (e.key === "Enter") {
      searchMeal();
    }
  };

  return (
    <div className="font-sans text-center p-6">
      {/* Header */}
      <div className="header bg-blue-600 p-4 text-white mb-4">
        <h1 className="text-3xl font-bold mb-6">Kitchen Quest 🍽</h1>
      </div>

      {/* Search input */}
      <div className="flex justify-center items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search meal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKey}
          className="border border-gray-300 rounded-lg px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button onClick={searchMeal} className="btn btn-primary">
          Search
        </button>
      </div>

      {/* Random button */}
      <button onClick={getMeal} className="btn btn-dark mb-6">
        Get Random Meal
      </button>

      {/* Loading message */}
      {loading && <p className="text-blue-500 font-medium">Fetching meal...</p>}

      {/* Error message */}
      {error && <p className="text-red-500 font-medium">{error}</p>}

      {/* Meal content */}
      {!loading && meal && (
        <div className="space-y-6 shadow-xl p-4">
          <h2 className="text-2xl font-semibold">{meal.strMeal}</h2>

          {/* Image + Ingredients */}
          <div className="flex flex-col md:flex-row items-start justify-center gap-8">
            {/* Meal Thumbnail */}
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-80 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            />

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-medium mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside text-left max-w-md">
                {getIngredients(meal).map((item, i) => (
                  <li key={i} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-xl font-medium mb-2">Instructions:</h3>
            <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">
              {meal.strInstructions}
            </p>
          </div>

          {/* YouTube Video */}
          {meal.strYoutube && (
            <div>
              <h3 className="text-xl font-medium mb-2">Watch Recipe:</h3>
              <div className="flex justify-center">
                <iframe
                  className="rounded-xl shadow-lg"
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${
                    meal.strYoutube.split("v=")[1]
                  }`}
                  title="YouTube video player"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-10 text-gray-400 text-sm p-4">
        Powered by{" "}
        <a
          href="https://www.themealdb.com/"
          className="text-gray-500 no-underline hover:underline"
        >
          TheMealDB
        </a>
      </footer>
    </div>
  );
}
