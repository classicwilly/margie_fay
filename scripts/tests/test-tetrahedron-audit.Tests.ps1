Describe 'Tetrahedron Audit Tests' {
    Context 'CSV parser and basic helpers' {
        It 'Parse-Csv-Manual handles quoted fields and commas' {
            $csv = @'
ID,Topology,Friction,Phase1,Phase2,MultiSensory
1,K4,0.007,0,0,True
2,"K4,alternate",0.008,0,0,False
'@
            $tmp = [IO.Path]::GetTempFileName()
            Set-Content -Path $tmp -Value $csv -Encoding UTF8
            . $PSScriptRoot\..\tetrahedron-audit.clean.ps1
            $rows = Parse-Csv-Manual -Path $tmp
            $rows | Should Not BeNullOrEmpty
            $rows.Count | Should Be 2
            Remove-Item $tmp -Force
        }

        It 'Test-MultiSensory recognizes true/false case-insensitively' {
            . $PSScriptRoot\..\tetrahedron-audit.clean.ps1
            $s1 = [pscustomobject]@{ MultiSensory='TRUE' }
            Test-MultiSensory $s1 $Protocol | Should Be $true
            $s2 = [pscustomobject]@{ MultiSensory='false' }
            Test-MultiSensory $s2 $Protocol | Should Be $false
        }

        It 'Test-FileContent finds patterns in a sample file' {
            $tmp2 = [IO.Path]::GetTempFileName()
            Set-Content -Path $tmp2 -Value "canvas requestAnimationFrame" -Encoding UTF8
            . $PSScriptRoot\..\tetrahedron-audit.clean.ps1
            $ok = Test-FileContent -Path $tmp2 -RequiredPatterns @('canvas','requestAnimationFrame') -Description 'temp test'
            $ok | Should Be $true
            Remove-Item $tmp2 -Force
        }
    }
}
