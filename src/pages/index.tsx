import type { NextPage } from "next";
import { client } from "../hooks/prismic";
import * as prismic from "@prismicio/client";
import Header from "../components/Header";
interface IProduto {
  id: string;
  slug: string;
  name: string;
  link: string;
  valueIn: string;
  valueFrom: string;
  imagem: string;
}
interface IHomeprops {
  produtos: IProduto[];
}
const Home: NextPage<IHomeprops> = ({ produtos }) => {
  console.log(produtos);
  return (
    <>
      <Header />
      <h2>Ola mundo</h2>
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  const response = await client.get({
    predicates: prismic.predicate.at("document.type", "produtos"),
    pageSize: 20,
    fetch: [
      "produtos.name",
      "produtos.content",
      "produtos.imagem",
      "produtos.valuein",
      "produtos.valuefrom",
      "produtos.link",
    ],
  });
  const produtos = response.results.map((produto) => {
    return {
      id: produto.id,
      slug: produto.uid,
      name: produto.data["name"][0]["text"],
      link: produto.data["link"]["url"],
      valueIn: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(produto.data["valuein"]),
      valueFrom: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(produto.data["valuefrom"]),
      imagem: produto.data["imagem"]["url"],
    };
  });

  return {
    props: { produtos },
  };
};
