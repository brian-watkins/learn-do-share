import * as Html from "@/display/markup"
import * as Style from "./style"

export function pageTitle(attributes: Array<Html.ViewAttribute>, text: string): Html.View {
  return Html.h3([...attributes, Style.bannerText(), Html.cssClasses([
    "mb-8",
    "mx-16"
  ])], [
    Html.text(text),
  ])
}

export function linkBox(href: string, text: string): Html.View {
  return Html.a([Style.link(), Html.cssClasses([
    "mt-8",
    "mx-16",
  ]), Html.href(href)], [
    Html.text(text)
  ])
}

export function cardBox(attributes: Array<Html.ViewAttribute>, children: Array<Html.ViewChild>): Html.View {
  return Html.section([...attributes, Style.box(), Html.cssClasses([
    "my-8",
    "flex",
    "items-center",
    "gap-8",
  ])], children)
}
