import * as Html from "@/display/markup"
import * as Style from "./style"
import { Colors, tag } from "./style"

export function header(attributes: Array<Html.ViewAttribute>, views: Array<Html.View>): Html.View {
  return Html.div([Html.cssClasses([
    "flex",
    "justify-between",
  ]), ...attributes], views)
}

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

export function headingBox(text: string): Html.View {
  return Html.div([
    tag(Colors.Light, Style.darkTextColor),
  ], [
    Html.text(text)
  ])
}

export function footer(): Html.View {
  return Html.div([Html.cssClasses([
    "bg-indigo-500",
    "mt-24",
    "mx-16",
    "h-12",
    "rounded-t-md"
  ])],[Html.text("Copyright Brian Watkins Industries, LLC 2022")])
}
