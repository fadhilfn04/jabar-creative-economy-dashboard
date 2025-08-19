import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, RotateCcw } from "lucide-react"

export function FiltersPanel() {
  return (
    <div className="minimal-card p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari Pelaku Ekonomi Kreatif, NIB, atau KBLI..."
            className="pl-10 border-gray-200 focus:border-gray-400"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Select>
            <SelectTrigger className="w-[180px] border-gray-200">
              <SelectValue placeholder="Subsektor EKRAF" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aplikasi">Aplikasi dan Game Developer</SelectItem>
              <SelectItem value="arsitektur">Arsitektur</SelectItem>
              <SelectItem value="desain-interior">Desain Interior</SelectItem>
              <SelectItem value="desain-komunikasi">Desain Komunikasi Visual</SelectItem>
              <SelectItem value="desain-produk">Desain Produk</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="film">Film, Animasi dan Video</SelectItem>
              <SelectItem value="fotografi">Fotografi</SelectItem>
              <SelectItem value="kriya">Kriya</SelectItem>
              <SelectItem value="kuliner">Kuliner</SelectItem>
              <SelectItem value="musik">Musik</SelectItem>
              <SelectItem value="penerbitan">Penerbitan</SelectItem>
              <SelectItem value="periklanan">Periklanan</SelectItem>
              <SelectItem value="seni-pertunjukan">Seni Pertunjukan</SelectItem>
              <SelectItem value="seni-rupa">Seni Rupa</SelectItem>
              <SelectItem value="televisi-radio">Televisi dan Radio</SelectItem>
              <SelectItem value="video-game">Video Game</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[150px] border-gray-200">
              <SelectValue placeholder="Kota/Kabupaten" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bandung">Bandung</SelectItem>
              <SelectItem value="bekasi">Bekasi</SelectItem>
              <SelectItem value="bogor">Bogor</SelectItem>
              <SelectItem value="cirebon">Cirebon</SelectItem>
              <SelectItem value="depok">Depok</SelectItem>
              <SelectItem value="sukabumi">Sukabumi</SelectItem>
              <SelectItem value="tasikmalaya">Tasikmalaya</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[120px] border-gray-200">
              <SelectValue placeholder="Status Modal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pma">PMA</SelectItem>
              <SelectItem value="pmdn">PMDN</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[100px] border-gray-200">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 bg-transparent">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
