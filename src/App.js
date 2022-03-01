import React, { useEffect, useState } from "react";
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import Header from "./components/Header/index";
import FeaturedMovie from "./components/FeaturedMovie";
import "./App.css";

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // pegando o filme em destaque (Featured)
      let originals = list.filter((i) => i.slug === "originals");
      let radomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      let chosen = originals[0].items.results[radomChosen];

      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");

      setFeaturedData(chosenInfo);
    };

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };
    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader} />

      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito com{" "}
        <span role="img" aria-label="coração">
          &#9825;
        </span>{" "}
        por Rohuldson <br />
        Direito de Dados e imagens: Netflix e Tmdb <br />
      </footer>
    </div>
  );
};
