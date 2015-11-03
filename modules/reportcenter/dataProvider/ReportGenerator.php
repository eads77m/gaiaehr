<?php
/**
 * GaiaEHR (Electronic Health Records)
 * Copyright (C) 2015 TRA NextGen, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

class ReportGenerator
{

    private $request;
    private $reportDir;
    public $format;
    public $fromGrid;
    private $conn;
    private $site;

    function __construct($site = 'default')
    {
        try
        {
            $this->site = $site;
            if(!defined('_GaiaEXEC')) define('_GaiaEXEC', 1);
            require_once('../../../registry.php');
            require_once("../../../sites/$this->site/conf.php");
            require_once('../../../classes/MatchaHelper.php');
            require_once('../../../classes/Array2XML.php');
        }
        catch(Exception $Error)
        {
            error_log(print_r($Error,true));
            return $Error;
        }
    }

    function setRequest($REQUEST)
    {
        try
        {
            if(!isset($REQUEST)) return;
            $this->request = json_decode($REQUEST['params'], true);
            $this->reportDir = $this->request['reportDir'];
            $this->format = $this->request['format'];
            $this->fromGrid = $this->request['grid'];
            unset($this->request['reportDir']);
            unset($this->request['format']);
            unset($this->request['grid']);
            error_log(print_r($this->request, true));
        }
        catch(Exception $Error)
        {
            error_log(print_r($Error,true));
            return $Error;
        }
    }

    function getXSLTemplate()
    {
        try
        {
            $filePointer = "../reports/$this->reportDir/report.xsl";
            if(file_exists($filePointer) && is_readable($filePointer))
            {
                return file_get_contents($filePointer);
            }
            else
            {
                throw new Exception('Error: Not XSLT file was found or readable.');
            }
        }
        catch(Exception $Error)
        {
            error_log(print_r($Error,true));
            return $Error;
        }
    }

    function getXMLDocument()
    {
        try
        {
            $this->conn = Matcha::getConn();
            $filePointer = "../reports/$this->reportDir/reportStatement.sql";

            // Important connection parameter, this will allow multiple
            // prepare tags with the same name.
            $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);

            if(file_exists($filePointer) && is_readable($filePointer))
            {
                // Get the SQL content
                $fileContent = file_get_contents($filePointer);
                $RunSQL = $this->conn->prepare($fileContent);

                error_log(print_r($this->request,true));

                // Copy all the request variables into the Prepared Values,
                // also check if it came from the grid form and normal form.
                // This because we need to do a POST-PREPARE the SQL statement
                if($this->fromGrid)
                {
                    // ...
                }
                else
                {
                    foreach($this->request as $field)
                    {
                        $PrepareField[':'.$field['name']] = $field['value'];
                    }
                }

                // Copy all the request filter variables to the XML,
                // also check if it came from the grid form and normal form.
                // This because we need to do a POST-PREPARE the SQL statement
                if($this->fromGrid)
                {
                    // ...
                }
                else
                {
                    foreach ($this->request as $field) {
                        $ReturnFilter[$field['name']] = $field['value'];
                    }
                }

                $RunSQL->execute($PrepareField);
                $records = $RunSQL->fetchAll(PDO::FETCH_ASSOC);
                $ExtraAttributes['xml-stylesheet'] = 'type="text/xsl" href="report.xsl"';
                Array2XML::init('1.0', 'UTF-8', true,$ExtraAttributes);
                $xml = Array2XML::createXML('records', array(
                    'filters' => $ReturnFilter,
                    'record' => $records
                ));
                return $xml->saveXML();
            }
            else
            {
                throw new Exception('Error: Not SQL Statement file was found or readable.');
            }
        }
        catch(Exception $Error)
        {
            error_log(print_r($Error,true));
            return $Error;
        }
    }
}

/**
 * This will combine the XML and the XSL
 * or generate the HTML, Text
 */
$rg = new ReportGenerator();
$rg->setRequest($_REQUEST);

switch($rg->format)
{
    case 'html':
        header('Content-Type: application/xslt+xml');
        header('Content-Disposition: inline; filename="report.html"');
        $xslt = new XSLTProcessor();
        $xslt->importStylesheet(new SimpleXMLElement($rg->getXSLTemplate()));
        echo $xslt->transformToXml(new SimpleXMLElement($rg->getXMLDocument()));
        break;
    case 'pdf':
        require_once('../../../lib/html2pdf_v4.03/html2pdf.class.php');
        $xslt = new XSLTProcessor();
        $xslt->importStylesheet(new SimpleXMLElement($rg->getXSLTemplate()));
        $html2pdf = new HTML2PDF('P', 'A4', 'en');
        $html2pdf->pdf->SetAuthor('GaiaEHR');
        $html2pdf->WriteHTML($xslt->transformToXml(new SimpleXMLElement($rg->getXMLDocument())));
        $PDFDocument = base64_encode($html2pdf->Output('exemple.pdf', "S"));
        echo '<object data="data:application/pdf;base64,' . $PDFDocument . '" type="application/pdf" width="100%" height="100%"></object>';
        break;
}

